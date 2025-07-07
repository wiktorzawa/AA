export interface Product {
  id_produktu_dostawy: number;
  id_dostawy?: string | null;
  nr_palety?: string | null;
  LPN?: string | null;
  kod_ean?: string | null;
  kod_asin?: string | null;
  nazwa_produktu: string;
  ilosc_w_magazynie: number;
  cena_jednostkowa: number;
  stan_produktu?: string | null;
  kraj_pochodzenia?: string | null;
  kategoria?: string | null;
  status?: "nowy" | "w_trakcie" | "zatwierdzony" | "odrzucony";
  uwagi_weryfikacji?: string | null;
  data_utworzenia: string;
  data_aktualizacji: string;

  // Pola, które mogą być dodane po stronie frontendu
  brand?: string;
  sales?: number;
  zdjecie_url?: string;
  szczegoly?: string;
}
