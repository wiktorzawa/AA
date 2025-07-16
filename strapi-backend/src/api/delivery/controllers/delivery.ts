import { factories } from '@strapi/strapi';

// Dodaj typy dla lepszej obsługi TypeScript
interface DeliveryDocument {
  id: string;
  documentId: string;
  idDostawcy: string;
  nrLotDostawy: string;
  nazwaPliku: string;
  urlPliku?: string;
  statusWeryfikacji: string;
  nrPaletDostawy?: string[];
  liczbaPozycji?: number;
  wartoscSzacunkowa?: number;
  supplier?: any;
  products?: any[];
  financials?: any;
  createdAt: string;
  updatedAt: string;
}

interface ProductDocument {
  id: string;
  documentId: string;
  nrPalety?: string;
  lpn?: string;
  kodEan?: string;
  kodAsin?: string;
  nazwaProduktu: string;
  ilosc: number;
  cenaProduktuSpec?: number;
  stanProduktu?: string;
  krajPochodzenia?: string;
  kategoriaProduktu?: string;
  statusWeryfikacji: string;
  uwagiWeryfikacji?: string;
  delivery?: any;
  createdAt: string;
  updatedAt: string;
}

export default factories.createCoreController(
  'api::delivery.delivery' as any,
  ({ strapi }) => ({
    // Nadpisanie domyślnej metody find aby zawsze pobierać relacje
    async find(ctx) {
      // Dodaj domyślne populate jeśli nie zostało określone
      if (!ctx.query.populate) {
        ctx.query.populate = {
          supplier: true,
          products: true,
          financials: true,
        };
      }

      // Wywołaj domyślną metodę find
      const { data, meta } = await super.find(ctx);

      return { data, meta };
    },

    // Endpoint: GET /api/deliveries/supplier/:supplierId
    async findBySupplier(ctx) {
      const { supplierId } = ctx.params;

      const deliveries = await strapi
        .documents('api::delivery.delivery' as any)
        .findMany({
          filters: {
            idDostawcy: supplierId,
          } as any,
          populate: {
            supplier: true,
            products: true,
            financials: true,
          } as any,
          sort: ['createdAt:desc'],
        });

      return {
        success: true,
        data: deliveries,
      };
    },

    // Endpoint: GET /api/deliveries/:id/analyze
    async analyze(ctx) {
      try {
        const { id } = ctx.params;

        const delivery = (await strapi
          .documents('api::delivery.delivery' as any)
          .findOne({
            documentId: id,
            populate: {
              supplier: true,
              products: true,
            } as any,
          })) as DeliveryDocument;

        if (!delivery) {
          return ctx.notFound('Dostawa nie została znaleziona');
        }

        // Analiza produktów
        const productStats = {
          total: delivery.products?.length || 0,
          byStatus: {} as Record<string, number>,
          byPalette: {} as Record<string, any>,
          totalValue: 0,
          totalQuantity: 0,
        };

        delivery.products?.forEach((product: any) => {
          // Statystyki po statusie
          const status = product.statusWeryfikacji || 'oczekuje';
          productStats.byStatus[status] =
            (productStats.byStatus[status] || 0) + 1;

          // Statystyki po palecie
          const paletteNumber = product.nrPalety || 'Brak palety';
          if (!productStats.byPalette[paletteNumber]) {
            productStats.byPalette[paletteNumber] = {
              count: 0,
              quantity: 0,
              value: 0,
              products: [],
            };
          }
          productStats.byPalette[paletteNumber].count++;
          productStats.byPalette[paletteNumber].quantity += product.ilosc || 0;
          productStats.byPalette[paletteNumber].value +=
            (product.cenaProduktuSpec || 0) * (product.ilosc || 0);
          productStats.byPalette[paletteNumber].products.push({
            nazwa: product.nazwaProduktu,
            ean: product.kodEan,
            asin: product.kodAsin,
            ilosc: product.ilosc,
            cena: product.cenaProduktuSpec,
          });

          // Totale
          productStats.totalQuantity += product.ilosc || 0;
          productStats.totalValue +=
            (product.cenaProduktuSpec || 0) * (product.ilosc || 0);
        });

        const paletteCount = new Set(
          delivery.products?.map((p: any) => p.nrPalety).filter(Boolean)
        ).size;

        return {
          delivery: {
            id_dostawy: delivery.idDostawcy,
            nazwa_pliku: delivery.nazwaPliku,
            status_weryfikacji: delivery.statusWeryfikacji,
            supplier: delivery.supplier,
          },
          analysis: {
            productStats,
            paletteCount,
            createdAt: delivery.createdAt,
            updatedAt: delivery.updatedAt,
          },
        };
      } catch (error) {
        strapi.log.error('Error in analyze controller:', error);
        return ctx.internalServerError('Wystąpił błąd podczas analizy');
      }
    },

    // Endpoint: POST /api/deliveries/upload
    async uploadFile(ctx) {
      try {
        // Sprawdzenie czy plik został przesłany
        if (!ctx.request.files || !ctx.request.files.deliveryFile) {
          return ctx.badRequest('Brak pliku dostawy');
        }

        const file = ctx.request.files.deliveryFile;
        const { id_dostawcy, confirmDeliveryNumber, columnMapping } =
          ctx.request.body;

        // Walidacja danych
        if (!id_dostawcy) {
          return ctx.badRequest('ID dostawcy jest wymagane');
        }

        // Wywołanie serwisu do przetworzenia pliku
        const deliveryService = strapi.service('api::delivery.delivery');
        const result = await deliveryService.processUploadedFile({
          file,
          supplierId: id_dostawcy,
          confirmDeliveryNumber,
          columnMapping: columnMapping ? JSON.parse(columnMapping) : null,
        });

        return {
          success: true,
          data: result,
        };
      } catch (error: any) {
        strapi.log.error('Błąd podczas uploadu pliku:', error);
        return ctx.badRequest(
          error.message || 'Błąd podczas przetwarzania pliku'
        );
      }
    },

    // Endpoint: POST /api/deliveries/preview
    async previewFile(ctx) {
      strapi.log.info('=== DELIVERY CONTROLLER - PREVIEW FILE START ===');

      try {
        if (!ctx.request.files || !ctx.request.files.deliveryFile) {
          return ctx.badRequest('Brak pliku dostawy');
        }

        const files = ctx.request.files.deliveryFile;
        const file = Array.isArray(files) ? files[0] : files;
        const { columnMapping } = ctx.request.body;

        const deliveryService = strapi.service('api::delivery.delivery');
        const preview = await deliveryService.previewFile({
          file,
          columnMapping: columnMapping ? JSON.parse(columnMapping) : null,
        });

        return {
          success: true,
          data: preview,
        };
      } catch (error: any) {
        strapi.log.error('Controller: Error during preview', error);
        return ctx.badRequest(
          error.message || 'Błąd podczas tworzenia podglądu'
        );
      }
    },

    // Endpoint: POST /api/deliveries/confirm
    async confirmDelivery(ctx) {
      try {
        if (!ctx.request.files || !ctx.request.files.file) {
          return ctx.badRequest('Brak pliku dostawy');
        }

        const file = ctx.request.files.file;
        const { delivery_number, id_dostawcy, mapping } = ctx.request.body;

        // Pobierz supplierId z profilu użytkownika jeśli nie podano
        let supplierId = id_dostawcy;

        if (!supplierId && ctx.state.user) {
          const supplier = await strapi.db
            .query('api::supplier.supplier')
            .findOne({
              where: { user: ctx.state.user.id },
            });

          if (supplier) {
            supplierId = supplier.supplierId;
          }
        }

        if (!supplierId) {
          return ctx.badRequest('Brak ID dostawcy');
        }

        const deliveryService = strapi.service('api::delivery.delivery');
        const result = await deliveryService.confirmAndSaveDelivery({
          file,
          supplierId,
          deliveryNumber: delivery_number,
          columnMapping: mapping ? JSON.parse(mapping) : null,
        });

        return {
          success: true,
          data: result,
        };
      } catch (error: any) {
        strapi.log.error('Błąd podczas potwierdzania dostawy:', error);
        return ctx.badRequest(
          error.message || 'Błąd podczas potwierdzania dostawy'
        );
      }
    },

    // Endpoint: POST /api/deliveries/:id/finances
    async createFinances(ctx) {
      try {
        const { id } = ctx.params;
        const { kurs_wymiany, procent_wartosci, stawka_vat, waluta } =
          ctx.request.body;

        // Walidacja danych
        if (!kurs_wymiany || kurs_wymiany <= 0) {
          return ctx.badRequest(
            'Kurs wymiany jest wymagany i musi być większy od 0'
          );
        }

        if (!procent_wartosci || procent_wartosci <= 0) {
          return ctx.badRequest(
            'Procent wartości jest wymagany i musi być większy od 0'
          );
        }

        if (stawka_vat === undefined || stawka_vat < 0) {
          return ctx.badRequest(
            'Stawka VAT jest wymagana i nie może być ujemna'
          );
        }

        if (!waluta) {
          return ctx.badRequest('Waluta jest wymagana');
        }

        // Pobierz dostawę z produktami
        const delivery = (await strapi
          .documents('api::delivery.delivery' as any)
          .findOne({
            documentId: id,
            populate: ['products'] as any,
          })) as DeliveryDocument;

        if (!delivery) {
          return ctx.notFound('Dostawa nie została znaleziona');
        }

        // Oblicz wartości finansowe
        const totalValue =
          delivery.products?.reduce(
            (sum: number, product: any) =>
              sum + product.cenaProduktuSpec * product.ilosc,
            0
          ) || 0;

        const financials = {
          kursWymiany: parseFloat(kurs_wymiany),
          procentWartosci: parseFloat(procent_wartosci),
          stawkaVat: parseFloat(stawka_vat),
          waluta: waluta,
          wartoscZeSpecyfikacjiSuma: totalValue,
          wartoscZeSpecyfikacjiSumaPln: totalValue * parseFloat(kurs_wymiany),
          kosztNetto:
            totalValue *
            parseFloat(kurs_wymiany) *
            parseFloat(procent_wartosci),
          kosztBrutto:
            totalValue *
            parseFloat(kurs_wymiany) *
            parseFloat(procent_wartosci) *
            (1 + parseFloat(stawka_vat)),
        };

        // Zaktualizuj dostawę z danymi finansowymi
        await strapi.documents('api::delivery.delivery' as any).update({
          documentId: id,
          data: {
            financials: financials,
          } as any,
        });

        return {
          success: true,
          data: {
            delivery: {
              id_dostawy: delivery.idDostawcy,
              nazwa_pliku: delivery.nazwaPliku,
            },
            finance: financials,
          },
        };
      } catch (error: any) {
        strapi.log.error('Błąd podczas tworzenia finansów:', error);
        return ctx.badRequest(
          error.message || 'Błąd podczas tworzenia danych finansowych'
        );
      }
    },

    // Endpoint: GET /api/deliveries/:id/products
    async getProducts(ctx) {
      const { id } = ctx.params;

      const products = (await strapi
        .documents('api::product.product' as any)
        .findMany({
          filters: {
            delivery: id,
          } as any,
        })) as ProductDocument[];

      // Mapuj na format oczekiwany przez frontend
      const mappedProducts = products.map((product: ProductDocument) => ({
        id_produktu_dostawy: product.id,
        id_dostawy: product.delivery?.idDostawcy,
        nr_palety: product.nrPalety,
        LPN: product.lpn,
        kod_ean: product.kodEan,
        kod_asin: product.kodAsin,
        nazwa_produktu: product.nazwaProduktu,
        ilosc: product.ilosc,
        cena_produktu_spec: product.cenaProduktuSpec,
        stan_produktu: product.stanProduktu,
        kraj_pochodzenia: product.krajPochodzenia,
        kategoria_produktu: product.kategoriaProduktu,
        status_weryfikacji: product.statusWeryfikacji,
        uwagi_weryfikacji: product.uwagiWeryfikacji,
        data_utworzenia: product.createdAt,
      }));

      return {
        success: true,
        data: mappedProducts,
      };
    },
  })
);
