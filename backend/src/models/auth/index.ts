// Importuj wszystkie modele i funkcje inicjalizujące
import {
  AuthDaneAutoryzacji,
  initAuthDaneAutoryzacji,
} from "./AuthDaneAutoryzacji";
import { AuthPracownicy, initAuthPracownicy } from "./AuthPracownicy";
import { AuthDostawcy, initAuthDostawcy } from "./AuthDostawcy";
import {
  AuthHistoriaLogowan,
  initAuthHistoriaLogowan,
} from "./AuthHistoriaLogowan";

// Definicja relacji między modelami
const setupAuthAssociations = () => {
  // Relacja między AuthDaneAutoryzacji a AuthPracownicy dla ADMIN
  AuthDaneAutoryzacji.belongsTo(AuthPracownicy, {
    foreignKey: "id_uzytkownika",
    targetKey: "id_pracownika",
    as: "admin",
    constraints: false,
    scope: {
      rola_uzytkownika: "admin",
    },
  });

  // Relacja między AuthDaneAutoryzacji a AuthPracownicy dla STAFF
  AuthDaneAutoryzacji.belongsTo(AuthPracownicy, {
    foreignKey: "id_uzytkownika",
    targetKey: "id_pracownika",
    as: "staff",
    constraints: false,
    scope: {
      rola_uzytkownika: "staff",
    },
  });

  AuthPracownicy.hasOne(AuthDaneAutoryzacji, {
    foreignKey: "id_uzytkownika",
    sourceKey: "id_pracownika",
    as: "daneAutoryzacji",
    constraints: false,
  });

  // Relacja między AuthDaneAutoryzacji a AuthDostawcy
  AuthDaneAutoryzacji.belongsTo(AuthDostawcy, {
    foreignKey: "id_uzytkownika",
    targetKey: "id_dostawcy",
    as: "supplier",
    constraints: false,
    scope: {
      rola_uzytkownika: "supplier",
    },
  });

  AuthDostawcy.hasOne(AuthDaneAutoryzacji, {
    foreignKey: "id_uzytkownika",
    sourceKey: "id_dostawcy",
    as: "daneAutoryzacji",
    constraints: false,
  });

  // Relacje z AuthHistoriaLogowan
  AuthDaneAutoryzacji.hasMany(AuthHistoriaLogowan, {
    foreignKey: "id_logowania",
    sourceKey: "id_logowania",
    as: "historia_logowan",
  });

  AuthHistoriaLogowan.belongsTo(AuthDaneAutoryzacji, {
    foreignKey: "id_logowania",
    targetKey: "id_logowania",
    as: "dane_autoryzacji",
  });
};

// Funkcja pobierająca użytkownika z szczegółami
const getUserWithDetails = async (email: string) => {
  const authData = await AuthDaneAutoryzacji.findOne({
    where: { adres_email: email },
  });
  if (!authData) return null;

  switch (authData.rola_uzytkownika) {
    case "admin":
      return AuthDaneAutoryzacji.findByPk(authData.id_logowania, {
        include: [{ model: AuthPracownicy, as: "admin" }],
      });
    case "staff":
      return AuthDaneAutoryzacji.findByPk(authData.id_logowania, {
        include: [{ model: AuthPracownicy, as: "staff" }],
      });
    case "supplier":
      return AuthDaneAutoryzacji.findByPk(authData.id_logowania, {
        include: [{ model: AuthDostawcy, as: "supplier" }],
      });
    default:
      return authData;
  }
};

// Eksportuj wszystko w sposób jawny i bezpośredni
export {
  AuthDaneAutoryzacji,
  AuthPracownicy,
  AuthDostawcy,
  AuthHistoriaLogowan,
  initAuthDaneAutoryzacji,
  initAuthPracownicy,
  initAuthDostawcy,
  initAuthHistoriaLogowan,
  setupAuthAssociations,
  getUserWithDetails,
};

// Eksportuj również typy atrybutów dla całej aplikacji
export type {
  AuthDaneAutoryzacjiAttributes,
  AuthDaneAutoryzacjiCreationAttributes,
} from "./AuthDaneAutoryzacji";
export type {
  AuthPracownicyAttributes,
  AuthPracownicyCreationAttributes,
} from "./AuthPracownicy";
export type {
  AuthDostawcyAttributes,
  AuthDostawcyCreationAttributes,
} from "./AuthDostawcy";
export type {
  AuthHistoriaLogowanAttributes,
  AuthHistoriaLogowanCreationAttributes,
} from "./AuthHistoriaLogowan";
