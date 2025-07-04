// Importuj i re-eksportuj wszystko z modułu 'auth'
export * from "./auth";

// Importuj i re-eksportuj wszystko z modułu 'deliveries'
export * from "./deliveries";

// AmazonProduct model został usunięty (nie był używany)

// --- GŁÓWNA FUNKCJA INICJALIZUJĄCA ---

import {
  AuthDaneAutoryzacji,
  AuthPracownicy,
  AuthDostawcy,
  AuthHistoriaLogowan,
  initAuthDaneAutoryzacji,
  initAuthPracownicy,
  initAuthDostawcy,
  initAuthHistoriaLogowan,
  setupAuthAssociations,
} from "./auth";
import {
  DostNowaDostawa,
  DostDostawyProdukty,
  DostFakturyDostawcow,
  DostFinanseDostaw,
  initDostNowaDostawa,
  initDostDostawyProdukty,
  initDostFakturyDostawcow,
  initDostFinanseDostaw,
} from "./deliveries";

/**
 * Funkcja inicjalizacji wszystkich modeli i ich relacji
 */
export const initializeAllModels = () => {
  // Najpierw inicjalizuj wszystkie modele
  initAuthDaneAutoryzacji();
  initAuthPracownicy();
  initAuthDostawcy();
  initAuthHistoriaLogowan();
  initDostNowaDostawa();
  initDostDostawyProdukty();
  initDostFakturyDostawcow();
  initDostFinanseDostaw();

  // Na końcu skonfiguruj wszystkie relacje
  setupAuthAssociations();
  // setupDeliveryAssociations(); // Ta funkcja zostanie dodana później, jeśli będzie potrzebna
};

// Eksport modeli auth
export {
  AuthDaneAutoryzacji,
  AuthPracownicy,
  AuthDostawcy,
  AuthHistoriaLogowan,
};

// Eksport modeli delivery
export {
  DostNowaDostawa,
  DostDostawyProdukty,
  DostFakturyDostawcow,
  DostFinanseDostaw,
};

// Setup functions
export { setupAuthAssociations };

// Domyślny eksport obiektu z wszystkimi modelami
export default {
  // Auth
  AuthDaneAutoryzacji,
  AuthPracownicy,
  AuthDostawcy,
  AuthHistoriaLogowan,

  // Delivery
  DostNowaDostawa,
  DostDostawyProdukty,
  DostFakturyDostawcow,
  DostFinanseDostaw,

  // Setup function
  initializeAllModels,
};
