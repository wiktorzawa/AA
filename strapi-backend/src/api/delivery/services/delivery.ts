import { factories } from '@strapi/strapi';
import * as XLSX from 'xlsx';
import * as fs from 'fs';

interface ProcessedProduct {
  nrPalety: string;
  lpn: string;
  kodEan: string;
  kodAsin: string;
  nazwaProduktu: string;
  ilosc: number;
  cenaProduktuSpec: number;
  stanProduktu: string;
  krajPochodzenia: string;
  kategoriaProduktu?: string;
}

interface ProcessedExcelData {
  deliveryNumber: string | null;
  products: ProcessedProduct[];
  paletteNumbers: string[];
  totalValue: number;
  hasHeaders: boolean;
  columnMapping: any;
  headers: string[];
}

interface ServiceParams {
  file: any;
  supplierId?: string;
  confirmDeliveryNumber?: string;
  columnMapping?: any;
  deliveryNumber?: string;
}

export default factories.createCoreService(
  'api::delivery.delivery' as any,
  ({ strapi }) => ({
    /**
     * Przetwarzanie uploadowanego pliku i zapis dostawy
     */
    async processUploadedFile(params: ServiceParams) {
      const { file, supplierId, confirmDeliveryNumber, columnMapping } = params;

      try {
        // Parsuj plik Excel
        const processedData = await this.parseExcelFile(file, columnMapping);

        // Ustal numer dostawy
        const deliveryNumber =
          confirmDeliveryNumber || processedData.deliveryNumber;

        if (!deliveryNumber) {
          throw new Error('Nie można określić numeru dostawy');
        }

        // Sprawdź czy dostawa już istnieje
        const existingDelivery = await strapi
          .documents('api::delivery.delivery' as any)
          .findMany({
            filters: {
              nrLotDostawy: deliveryNumber,
              idDostawcy: supplierId,
            } as any,
            limit: 1,
          });

        if (existingDelivery && existingDelivery.length > 0) {
          throw new Error(
            `Dostawa o numerze ${deliveryNumber} już istnieje dla tego dostawcy`
          );
        }

        // Zapisz plik (opcjonalnie - jeśli masz skonfigurowany upload)
        let fileUrl = null;
        if (strapi.plugin('upload')) {
          const uploadedFile = await strapi
            .plugin('upload')
            .services.upload.upload({
              data: {},
              files: file,
            });
          fileUrl = uploadedFile[0]?.url;
        }

        // Utwórz dostawę
        const delivery = await strapi
          .documents('api::delivery.delivery' as any)
          .create({
            data: {
              idDostawcy: supplierId,
              nrLotDostawy: deliveryNumber,
              nazwaPliku: file.name || file.originalName || file.filename,
              urlPliku: fileUrl,
              statusWeryfikacji: 'oczekuje',
              nrPaletDostawy: processedData.paletteNumbers,
              liczbaPozycji: processedData.products.length,
              wartoscSzacunkowa: processedData.totalValue,
              supplier: {
                connect: [supplierId],
              },
            } as any,
          });

        // Zapisz produkty
        const createdProducts = [];
        for (const product of processedData.products) {
          const createdProduct = await strapi
            .documents('api::product.product' as any)
            .create({
              data: {
                ...product,
                delivery: delivery.id,
                statusWeryfikacji: 'oczekuje',
              } as any,
            });
          createdProducts.push(createdProduct);
        }

        // Zaktualizuj dostawę z ID produktów
        await strapi.documents('api::delivery.delivery' as any).update({
          documentId: delivery.documentId,
          data: {
            products: {
              connect: createdProducts.map(p => p.id),
            },
          } as any,
        });

        return {
          delivery: {
            ...delivery,
            products: createdProducts,
          },
          message: `Dostawa ${deliveryNumber} została pomyślnie zapisana`,
        };
      } catch (error) {
        strapi.log.error('Error processing uploaded file:', error);
        throw error;
      }
    },

    /**
     * Podgląd pliku bez zapisywania
     */
    async previewFile(params: ServiceParams) {
      const { file, columnMapping } = params;

      try {
        const processedData = await this.parseExcelFile(file, columnMapping);

        return {
          deliveryNumber: processedData.deliveryNumber,
          headers: processedData.headers,
          hasHeaders: processedData.hasHeaders,
          products: processedData.products.slice(0, 10), // Pierwsze 10 produktów
          totalProducts: processedData.products.length,
          paletteNumbers: processedData.paletteNumbers,
          totalValue: processedData.totalValue,
          columnMapping: processedData.columnMapping,
        };
      } catch (error) {
        strapi.log.error('Error in preview file:', error);
        throw error;
      }
    },

    /**
     * Potwierdzenie i zapis dostawy
     */
    async confirmAndSaveDelivery(params: ServiceParams) {
      const { file, supplierId, deliveryNumber, columnMapping } = params;

      return this.processUploadedFile({
        file,
        supplierId,
        confirmDeliveryNumber: deliveryNumber,
        columnMapping,
      });
    },

    /**
     * Parsowanie pliku Excel
     */
    async parseExcelFile(
      file: any,
      columnMapping: any
    ): Promise<ProcessedExcelData> {
      strapi.log.info('Starting Excel file parsing');

      const filePath = file.path || file.tmpPath || file.filepath;

      if (!filePath || !fs.existsSync(filePath)) {
        throw new Error('Nie można odnaleźć pliku');
      }

      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Konwertuj do JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (!jsonData || jsonData.length === 0) {
        throw new Error('Plik jest pusty');
      }

      // Wykryj nagłówki
      const headers = jsonData[0] as string[];
      const hasHeaders = this.detectHeaders(headers);
      const dataStartRow = hasHeaders ? 1 : 0;

      // Mapowanie kolumn
      const mapping = columnMapping || this.autoDetectMapping(headers);

      // Przetwórz produkty
      const products = [];
      const paletteNumbers = new Set<string>();
      let totalValue = 0;
      let deliveryNumber = null;

      for (let i = dataStartRow; i < jsonData.length; i++) {
        const row = jsonData[i] as any[];

        // Pomiń puste wiersze
        if (!row || row.every((cell: any) => !cell)) continue;

        // Wykryj numer dostawy (często w pierwszych wierszach)
        if (!deliveryNumber && i < 5) {
          deliveryNumber = this.detectDeliveryNumber(row);
        }

        const product = this.mapRowToProduct(row, mapping);

        if (product && product.nazwaProduktu) {
          products.push(product);

          if (product.nrPalety) {
            paletteNumbers.add(product.nrPalety);
          }

          totalValue += (product.cenaProduktuSpec || 0) * (product.ilosc || 0);
        }
      }

      return {
        deliveryNumber,
        products,
        paletteNumbers: Array.from(paletteNumbers),
        totalValue,
        hasHeaders,
        columnMapping: mapping,
        headers,
      };
    },

    /**
     * Wykrywanie czy pierwszy wiersz to nagłówki
     */
    detectHeaders(firstRow: any[]): boolean {
      if (!firstRow || firstRow.length === 0) return false;

      const headerKeywords = [
        'palette',
        'lpn',
        'ean',
        'asin',
        'product',
        'quantity',
        'paleta',
        'produkt',
        'ilosc',
        'nazwa',
        'kod',
        'cena',
      ];

      const rowAsString = firstRow.join(' ').toLowerCase();

      return headerKeywords.some(keyword => rowAsString.includes(keyword));
    },

    /**
     * Automatyczne wykrywanie mapowania kolumn
     */
    autoDetectMapping(headers: any[]): Record<string, number> {
      if (!headers || headers.length === 0) {
        // Domyślne mapowanie dla plików bez nagłówków
        return {
          nrPalety: 0,
          lpn: 1,
          kodEan: 2,
          kodAsin: 3,
          nazwaProduktu: 4,
          ilosc: 5,
          cenaProduktuSpec: 6,
          stanProduktu: 7,
          krajPochodzenia: 8,
        };
      }

      const mapping: Record<string, number> = {};
      const mappingRules = {
        nrPalety: ['palette', 'pallet', 'paleta', 'nr palety'],
        lpn: ['lpn', 'license plate'],
        kodEan: ['ean', 'kod ean', 'ean code'],
        kodAsin: ['asin', 'kod asin'],
        nazwaProduktu: ['product', 'name', 'produkt', 'nazwa', 'description'],
        ilosc: ['quantity', 'qty', 'ilosc', 'liczba', 'amount'],
        cenaProduktuSpec: ['price', 'cena', 'value', 'wartosc'],
        stanProduktu: ['condition', 'stan', 'status'],
        krajPochodzenia: ['country', 'origin', 'kraj', 'pochodzenie'],
      };

      headers.forEach((header: any, index: number) => {
        const headerLower = header.toString().toLowerCase();

        for (const [field, keywords] of Object.entries(mappingRules)) {
          if (keywords.some(keyword => headerLower.includes(keyword))) {
            mapping[field] = index;
            break;
          }
        }
      });

      return mapping;
    },

    /**
     * Wykrywanie numeru dostawy
     */
    detectDeliveryNumber(row: any[]): string | null {
      for (const cell of row) {
        if (!cell) continue;

        const cellStr = cell.toString();

        // Szukaj wzorców numerów lotów
        const patterns = [
          /FBA\d+/i,
          /LOT[\s-]?\d+/i,
          /DELIVERY[\s-]?\d+/i,
          /SHIPMENT[\s-]?\d+/i,
          /\d{4}-\d{2}-\d{2}-\d+/,
        ];

        for (const pattern of patterns) {
          const match = cellStr.match(pattern);
          if (match) {
            return match[0];
          }
        }
      }

      return null;
    },

    /**
     * Mapowanie wiersza na produkt
     */
    mapRowToProduct(
      row: any[],
      mapping: Record<string, number>
    ): ProcessedProduct {
      const getValue = (field: string) => {
        const index = mapping[field];
        return index !== undefined ? row[index] : null;
      };

      const product: ProcessedProduct = {
        nrPalety: getValue('nrPalety')?.toString() || '',
        lpn: getValue('lpn')?.toString() || '',
        kodEan: getValue('kodEan')?.toString() || '',
        kodAsin: getValue('kodAsin')?.toString() || '',
        nazwaProduktu: getValue('nazwaProduktu')?.toString() || '',
        ilosc: parseInt(getValue('ilosc')) || 0,
        cenaProduktuSpec: parseFloat(getValue('cenaProduktuSpec')) || 0,
        stanProduktu: getValue('stanProduktu')?.toString() || 'Nowy',
        krajPochodzenia: getValue('krajPochodzenia')?.toString() || 'Nieznany',
        kategoriaProduktu:
          getValue('kategoriaProduktu')?.toString() || undefined,
      };

      return product;
    },
  })
);
