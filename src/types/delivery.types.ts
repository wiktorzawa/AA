export type PreviewStatus =
  | "SUKCES"
  | "WYMAGA_POTWIERDZENIA"
  | "WYMAGA_MAPOWANIA"
  | "BŁĄD";

export interface FilePreviewResponse {
  analysisStatus: PreviewStatus;
  products: PreviewProduct[];
  availableColumns: string[];
  columnMapping: ColumnMapping;
  deliveryNumber: string | null;
  paletteNumbers: string[];
  totalProducts: number;
  estimatedValue: number;
  fileName: string;
  hasHeaders: boolean;
  productSample: PreviewProduct[];
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

export interface ValidationError {
  type: "critical" | "warning";
  code: string;
  message: string;
  field?: string;
  rowNumber?: number;
  affectedProducts?: number;
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
