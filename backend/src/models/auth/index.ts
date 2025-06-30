// Import wszystkich modeli autoryzacji
import AuthDaneAutoryzacji, {
  initAuthDaneAutoryzacji,
} from "./AuthDaneAutoryzacji";
import AuthPracownicy, { initAuthPracownicy } from "./AuthPracownicy";
import AuthDostawcy, { initAuthDostawcy } from "./AuthDostawcy";
import AuthHistoriaLogowan, {
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

// Funkcja pobierająca użytkownika z szczegółami na podstawie email
const getUserWithDetails = async (email: string) => {
  // Najpierw pobierz podstawowe dane autoryzacji
  const authData = await AuthDaneAutoryzacji.findOne({
    where: { adres_email: email },
  });

  if (!authData) return null;

  // Na podstawie roli, pobierz odpowiednie dane w jednym zapytaniu
  switch (authData.rola_uzytkownika) {
    case "admin":
      return await AuthDaneAutoryzacji.findByPk(authData.id_logowania, {
        include: [{ model: AuthPracownicy, as: "admin" }],
      });

    case "staff":
      return await AuthDaneAutoryzacji.findByPk(authData.id_logowania, {
        include: [{ model: AuthPracownicy, as: "staff" }],
      });

    case "supplier":
      return await AuthDaneAutoryzacji.findByPk(authData.id_logowania, {
        include: [{ model: AuthDostawcy, as: "supplier" }],
      });

    default:
      return authData;
  }
};

// Eksport modeli i funkcji konfiguracji
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

// Domyślny eksport obiektu z wszystkimi modelami
export default {
  AuthDaneAutoryzacji,
  AuthPracownicy,
  AuthDostawcy,
  AuthHistoriaLogowan,
  setupAssociations: setupAuthAssociations,
  getUserWithDetails,
};
