import { DeliveryStatus } from "../constants";

// Status types for deliveries
// export type DeliveryStatus =
//   | "nowa"
//   | "trwa weryfikacja"
//   | "zweryfikowano"
//   | "raport"
//   | "zakończono";
export type ProductVerificationStatus =
  | "nowy"
  | "w_trakcie"
  | "zatwierdzony"
  | "odrzucony";
export type InvoicePaymentStatus = "pending" | "paid" | "overdue" | "cancelled";
export type PreviewStatus = "success" | "requires_manual_input";

// File upload types
export interface FileUploadResponse {
  id_dostawy: string;
  id_dostawcy: string;
  nazwa_pliku: string;
  nr_palet_dostawy?: string;
  status_weryfikacji: DeliveryStatus;
  liczba_produktow: number;
  wartosc_calkowita: number;
  url_pliku_S3: string;
  data_utworzenia: string;
}

export interface FilePreviewResponse {
  status: PreviewStatus;
  missingFields?: ("deliveryNumber" | "paletteNumber")[];
  detectedDeliveryNumber?: string | null;
  detectedPaletteNumbers?: string[];
  fileName: string;
  totalProducts: number;
  estimatedValue: number;
  productSample: PreviewProduct[];
  columnMapping: ColumnMapping;
  validationWarnings?: string[];
  validationDetails?: ValidationDetails;
}

export interface PreviewProduct {
  nr_palety?: string;
  nazwa_produktu: string;
  kod_ean?: string;
  kod_asin?: string;
  ilosc: number;
  cena_produktu_spec?: number;
  lpn?: string;
  stan_produktu?: string;
  kraj_pochodzenia?: string;
  kategoria_produktu?: string;
}

export interface ColumnMapping {
  paletteNumber?: string;
  productName?: string;
  ean?: string;
  asin?: string;
  quantity?: string;
  price?: string;
  lpn?: string;
  condition?: string;
  country?: string;
  department?: string;
  category?: string;
  subcategory?: string;
}

export interface ProcessedExcelData {
  deliveryNumber: string | null;
  paletteNumbers: string[];
  products: PreviewProduct[];
  totalValue: number;
  columnMapping: ColumnMapping;
}

// Request/Response interfaces for API
export interface CreateDeliveryRequest {
  id_dostawcy: string;
  nazwa_pliku: string;
  url_pliku_S3: string;
  nr_palet_dostawy?: string;
  products?: CreateProductRequest[];
}

export interface CreateProductRequest {
  nr_palety?: string;
  LPN?: string;
  kod_ean?: string;
  kod_asin?: string;
  nazwa_produktu: string;
  ilosc?: number;
  cena_produktu_spec?: number;
  stan_produktu?: string;
  kraj_pochodzenia?: string;
  kategoria_produktu?: string;
}

export interface UpdateDeliveryStatusRequest {
  status_weryfikacji: DeliveryStatus;
}

export interface UpdateInvoiceStatusRequest {
  status_platnosci: InvoicePaymentStatus;
  data_platnosci_faktycznej?: string; // ISO date string
}

// Response interfaces
export interface DeliveryResponse {
  id_dostawy: string;
  id_dostawcy: string;
  id_pliku: string;
  nazwa_pliku: string;
  url_pliku_S3: string;
  nr_palet_dostawy?: string;
  status_weryfikacji: DeliveryStatus;
  data_utworzenia: string;
  data_aktualizacji: string;
  // Relacje
  products?: ProductResponse[];
  finances?: FinancesResponse;
  invoices?: InvoiceResponse[];
}

export interface ProductResponse {
  id_produktu_dostawy: number;
  id_dostawy?: string;
  nr_palety?: string;
  LPN?: string;
  kod_ean?: string;
  kod_asin?: string;
  nazwa_produktu: string;
  ilosc: number;
  cena_produktu_spec?: number;
  stan_produktu?: string;
  kraj_pochodzenia?: string;
  kategoria_produktu?: string;
  status_weryfikacji: ProductVerificationStatus;
  uwagi_weryfikacji?: string;
  data_utworzenia: string;
  data_aktualizacji: string;
}

export interface InvoiceResponse {
  id_faktury: number;
  id_dostawcy: string;
  id_dostawy?: string;
  numer_faktury: string;
  data_faktury: string;
  data_platnosci: string;
  kwota_brutto_razem: number;
  kwota_netto_razem: number;
  waluta: string;
  status_platnosci: InvoicePaymentStatus;
  data_platnosci_faktycznej?: string;
  data_utworzenia: string;
  data_aktualizacji: string;
}

export interface FinancesResponse {
  id_finanse_dostawy: number;
  id_dostawy: string;
  suma_produktow: number;
  wartosc_produktow_spec: number;
  stawka_vat: number;
  procent_wartosci: number;
  wartosc_brutto: number;
  koszt_pln_brutto: number;
  koszt_pln_netto: number;
  waluta: string;
  kurs_wymiany?: number;
  data_utworzenia: string;
  data_aktualizacji: string;
  // Calculated fields
  margin?: number;
  profit_pln?: number;
}

// Statistics interfaces
export interface DeliveryStatsResponse {
  total_deliveries: number;
  by_status: Record<DeliveryStatus, number>;
  by_supplier: Record<string, number>;
  recent_deliveries: DeliveryResponse[];
}

export interface ProductStatsResponse {
  total_products: number;
  total_quantity: number;
  by_status: Record<ProductVerificationStatus, number>;
  by_country: Record<string, number>;
  top_products: ProductResponse[];
}

export interface InvoiceStatsResponse {
  total_invoices: number;
  total_amount: number;
  by_status: Record<InvoicePaymentStatus, { count: number; amount: number }>;
  overdue_count: number;
  by_supplier: Record<string, { count: number; amount: number }>;
}

export interface FinancialSummaryResponse {
  total_deliveries: number;
  total_products: number;
  total_value_pln: number;
  total_cost_pln: number;
  by_currency: Record<string, { count: number; total_value: number }>;
  average_margin: number;
}

// Filter interfaces
export interface DeliveryFilters {
  id_dostawcy?: string;
  status_weryfikacji?: DeliveryStatus;
  data_od?: string;
  data_do?: string;
  nazwa_pliku?: string;
}

export interface ProductFilters {
  id_dostawy?: string;
  status_weryfikacji?: ProductVerificationStatus;
  kod_ean?: string;
  kod_asin?: string;
  kraj_pochodzenia?: string;
  nazwa_produktu?: string;
}

export interface InvoiceFilters {
  id_dostawcy?: string;
  status_platnosci?: InvoicePaymentStatus;
  data_faktury_od?: string;
  data_faktury_do?: string;
  data_platnosci_od?: string;
  data_platnosci_do?: string;
  waluta?: string;
}

// Pagination interface
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ValidationDetails {
  criticalErrors: ValidationError[];
  warnings: ValidationError[];
  missingDataSummary: {
    productsWithoutPalette: number;
    productsWithoutEAN: number;
    productsWithoutPrice: number;
    productsWithoutQuantity: number;
  };
  dataQualityScore: number; // 0-100
  recommendedAction: "proceed" | "review_required" | "manual_correction_needed";
}

export interface ValidationError {
  type: "critical" | "warning";
  code: string;
  message: string;
  field?: string;
  rowNumber?: number;
  affectedProducts?: number;
}

export interface ConfirmDeliveryRequest {
  fileName: string;
  detectedDeliveryNumber?: string | null;
  confirmedDeliveryNumber?: string;
  detectedPaletteNumbers?: string[];
  confirmedPaletteNumbers?: string[];
  productCorrections?: ProductCorrection[];
  bypassValidation?: boolean;
}

export interface ProductCorrection {
  index: number; // Index in original products array
  corrections: Partial<PreviewProduct>;
}

export interface ConfirmDeliveryResponse {
  id_dostawy: string;
  id_dostawcy: string;
  nazwa_pliku: string;
  nr_palet_dostawy?: string;
  status_weryfikacji: DeliveryStatus;
  liczba_produktow: number;
  wartosc_calkowita: number;
  url_pliku_S3: string;
  data_utworzenia: string;
  validationSummary: {
    totalWarnings: number;
    totalErrors: number;
    appliedCorrections: number;
  };
}
