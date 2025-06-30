// Import modeli auth i delivery
import AuthModels, { setupAuthAssociations } from "./auth";
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
import {
  initAuthDaneAutoryzacji,
  initAuthPracownicy,
  initAuthDostawcy,
  initAuthHistoriaLogowan,
} from "./auth";

/**
 * Funkcja konfiguracji relacji dla wszystkich modeli
 */
const setupAllAssociations = () => {
  // Konfiguracja relacji dla modułu auth
  setupAuthAssociations();

  // Konfiguracja relacji dla modułu delivery
  setupDeliveryAssociations();
};

/**
 * Funkcja konfiguracji relacji dla modeli dostaw
 */
const setupDeliveryAssociations = () => {
  // DostNowaDostawa -> AuthDostawcy
  DostNowaDostawa.belongsTo(AuthModels.AuthDostawcy, {
    foreignKey: "id_dostawcy",
    as: "dostawca",
  });

  // DostDostawyProdukty -> DostNowaDostawa
  DostDostawyProdukty.belongsTo(DostNowaDostawa, {
    foreignKey: "id_dostawy",
    as: "dostawa",
  });

  // DostNowaDostawa -> DostDostawyProdukty (hasMany)
  DostNowaDostawa.hasMany(DostDostawyProdukty, {
    foreignKey: "id_dostawy",
    as: "products",
  });

  // DostFakturyDostawcow -> AuthDostawcy
  DostFakturyDostawcow.belongsTo(AuthModels.AuthDostawcy, {
    foreignKey: "id_dostawcy",
    as: "dostawca",
  });

  // DostFakturyDostawcow -> DostNowaDostawa
  DostFakturyDostawcow.belongsTo(DostNowaDostawa, {
    foreignKey: "id_dostawy",
    as: "dostawa",
  });

  // DostFinanseDostaw -> DostNowaDostawa
  DostFinanseDostaw.belongsTo(DostNowaDostawa, {
    foreignKey: "id_dostawy",
    as: "dostawa",
  });

  // DostNowaDostawa -> DostFinanseDostaw (hasOne)
  DostNowaDostawa.hasOne(DostFinanseDostaw, {
    foreignKey: "id_dostawy",
    as: "finances",
  });

  // DostNowaDostawa -> DostFakturyDostawcow (hasMany)
  DostNowaDostawa.hasMany(DostFakturyDostawcow, {
    foreignKey: "id_dostawy",
    as: "invoices",
  });
};

/**
 * Funkcja inicjalizacji wszystkich modeli
 */
export const initializeAllModels = () => {
  // Najpierw inicjalizuj modele auth
  initAuthDaneAutoryzacji();
  initAuthPracownicy();
  initAuthDostawcy();
  initAuthHistoriaLogowan();

  // Następnie inicjalizuj modele dostaw
  initDostNowaDostawa();
  initDostDostawyProdukty();
  initDostFakturyDostawcow();
  initDostFinanseDostaw();

  // Na końcu konfiguruj relacje
  setupAllAssociations();
};

// Eksport modeli auth
export const AuthDaneAutoryzacji = AuthModels.AuthDaneAutoryzacji;
export const AuthPracownicy = AuthModels.AuthPracownicy;
export const AuthDostawcy = AuthModels.AuthDostawcy;
export const AuthHistoriaLogowan = AuthModels.AuthHistoriaLogowan;

// Eksport modeli delivery
export {
  DostNowaDostawa,
  DostDostawyProdukty,
  DostFakturyDostawcow,
  DostFinanseDostaw,
};

// Setup functions
export {
  setupAllAssociations,
  setupAuthAssociations,
  setupDeliveryAssociations,
};

// Domyślny eksport obiektu z wszystkimi modelami
export default {
  // Auth
  AuthDaneAutoryzacji: AuthModels.AuthDaneAutoryzacji,
  AuthPracownicy: AuthModels.AuthPracownicy,
  AuthDostawcy: AuthModels.AuthDostawcy,
  AuthHistoriaLogowan: AuthModels.AuthHistoriaLogowan,

  // Delivery
  DostNowaDostawa,
  DostDostawyProdukty,
  DostFakturyDostawcow,
  DostFinanseDostaw,

  // Setup function
  setupAssociations: setupAllAssociations,
  initializeAllModels,
};
