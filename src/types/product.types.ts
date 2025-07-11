export interface Product {
  id: number;
  nazwa_produktu: string;
  kod_ean?: string | null;
  kod_asin?: string | null;
  lpn?: string | null;
  ilosc: number;
  cena_produktu_spec?: number | null;
  stan_produktu?: "nowy" | "uzywany" | "odnowiony" | "uszkodzony";
  kraj_pochodzenia?: string | null;
  kategoria_produktu?: string | null;
  status_weryfikacji: "nowy" | "w_trakcie" | "zatwierdzony" | "odrzucony";
  uwagi_weryfikacji?: string | null;
  delivery?: DeliveryRelation;
  palette?: PaletteRelation;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryRelation {
  id: number;
  id_dostawy: string;
  // Dodaj inne potrzebne pola
}

export interface PaletteRelation {
  id: number;
  nr_palety: string;
  // Dodaj inne potrzebne pola
}
