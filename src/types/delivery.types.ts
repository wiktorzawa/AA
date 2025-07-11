import type { Product } from "./product.types";
import type { Supplier } from "./supplier.types";

export interface Delivery {
  id: number;
  id_dostawy: string;
  id_dostawcy: string;
  id_pliku: string;
  nazwa_pliku: string;
  url_pliku_S3: string;
  nr_palet_dostawy?: string | null;
  nr_lot_dostawy?: string | null;
  status_weryfikacji:
    | "nowa"
    | "trwa weryfikacja"
    | "zweryfikowano"
    | "raport"
    | "zakończono";
  supplier?: Supplier | null;
  products?: Product[] | null;
  createdAt: string;
  updatedAt: string;
}
