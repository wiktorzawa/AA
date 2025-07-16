# Szczegółowa Dokumentacja Procesu Logowania

**Data:** 15.01.2025  
**Wersja:** 2.0 (po migracji na Strapi v5)  
**Status:** Aktualny

## 📋 Przegląd Systemu

Aplikacja implementuje **dwuetapowy proces logowania** wykorzystujący:

- **Backend:** Strapi v5 z rozszerzonym Users & Permissions Plugin
- **Frontend:** React + TypeScript z Zustand store
- **Autoryzacja:** JWT tokens z role-based access control
- **Relacje:** User ↔ Staff/Supplier profiles

---

## 🔄 Przepływ Logowania - Szczegółowy Opis

### **ETAP 1: Uwierzytelnianie użytkownika**

#### **1.1 Frontend - Formularz logowania**

**Plik:** `src/pages/authentication/sign-in-background.tsx`

**Wyjaśnienie:** Ten fragment kodu obsługuje zdarzenie przesłania formularza logowania. Funkcja `handleSubmit` jest wywoływana, gdy użytkownik kliknie przycisk "Zaloguj się". Zarządza stanem ładowania, obsługuje błędy i przekierowuje użytkownika na odpowiedni dashboard w zależności od jego roli.

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  // Zapobiega domyślnemu przeładowaniu strony po przesłaniu formularza
  e.preventDefault();

  // Ustawia stan ładowania na true, aby pokazać spinner/loader użytkownikowi
  setIsLoading(true);

  // Czyści poprzednie komunikaty o błędach
  setError("");

  try {
    // Tworzy obiekt z danymi logowania z formularza
    const credentials: DaneLogowania = {
      email: formData.email,
      password: formData.password,
    };

    // Wywołuje główną funkcję logowania z API - to jest klucz całego procesu
    // Ta funkcja wykonuje wszystkie 4 etapy logowania w tle
    const result = await zaloguj(credentials);

    // Sprawdza czy logowanie się powiodło i czy otrzymano rolę użytkownika
    if (result.success && result.appRole) {
      // Przekierowuje użytkownika na odpowiedni dashboard w zależności od roli
      // Każdy typ użytkownika ma swój dedykowany dashboard
      switch (result.appRole) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "staff":
          navigate("/staff/dashboard");
          break;
        case "supplier":
          navigate("/supplier/dashboard");
          break;
        default:
          navigate("/");
      }
    } else {
      // Wyświetla komunikat o błędzie jeśli logowanie się nie powiodło
      setError(result.error?.message || "Błąd logowania");
    }
  } catch (error) {
    // Obsługuje nieoczekiwane błędy (np. problemy z siecią)
    setError("Wystąpił nieoczekiwany błąd");
  } finally {
    // Zawsze wyłącza stan ładowania, niezależnie od wyniku
    setIsLoading(false);
  }
};
```

#### **1.2 API Layer - Wysłanie żądania do Strapi**

**Plik:** `src/api/authApi.ts`

**Wyjaśnienie:** To jest główna funkcja logowania, która koordynuje cały proces uwierzytelniania. Najpierw wysyła dane logowania do Strapi, aby otrzymać token JWT. Token jest kluczem do wszystkich dalszych operacji - pozwala na autoryzowane zapytania do API. Po otrzymaniu tokenu, funkcja przechodzi do etapu 2 (pobieranie profilu użytkownika).

```typescript
export const zaloguj = async (
  credentials: DaneLogowania,
): Promise<OdpowiedzLogowania> => {
  try {
    // Loguje początek procesu logowania dla celów debugowania
    console.log("🚀 ROZPOCZĘCIE LOGOWANIA:", credentials.email);

    // 1. Przygotowuje dane do wysłania do Strapi
    // Strapi oczekuje pola 'identifier' (może być email lub username) i 'password'
    const loginPayload = {
      identifier: credentials.email, // Strapi akceptuje email jako identyfikator
      password: credentials.password,
    };

    // Wysyła żądanie POST do endpointu uwierzytelniania Strapi
    // Endpoint /auth/local jest standardowym endpointem Strapi do logowania lokalnego
    const loginResponse = await strapiAdapter.post<
      typeof loginPayload,
      { jwt: string; user: StrapiUser }
    >("/auth/local", loginPayload);

    // Sprawdza czy odpowiedź zawiera wymagane dane
    // JWT token jest niezbędny do autoryzacji dalszych zapytań
    if (!loginResponse.jwt || !loginResponse.user) {
      throw new Error("Brak tokenu JWT lub danych użytkownika w odpowiedzi.");
    }

    // Wyciąga token i podstawowe dane użytkownika z odpowiedzi
    const { jwt, user } = loginResponse;

    // 2. Zapisuje token w localStorage przeglądarki
    // Token będzie automatycznie dodawany do nagłówków wszystkich zapytań
    localStorage.setItem("token", jwt);
    console.log("✅ TOKEN ZAPISANY, pobieranie profilu użytkownika...");

    // W tym momencie przechodzimy do ETAPU 2 - pobierania profilu użytkownika
    // ...
  } catch (error) {
    // Loguje błędy dla celów debugowania
    console.error("🚨 BŁĄD LOGOWANIA:", error);
    // Obsługa błędów...
  }
};
```

#### **1.3 Strapi Adapter - Konfiguracja komunikacji**

**Plik:** `src/api/strapiAdapter.ts`

**Wyjaśnienie:** Strapi Adapter to warstwa abstrakcji, która konfiguruje komunikację z backendem Strapi. Tworzy instancję Axios z bazowym URL i nagłówkami. Najważniejszy jest interceptor request, który automatycznie dodaje token JWT do każdego zapytania (oprócz logowania), oraz interceptor response, który obsługuje wygaśnięcie tokenów przez automatyczne wylogowanie użytkownika.

```typescript
// Pobiera URL Strapi z zmiennych środowiskowych lub używa domyślnego
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_URL = `${STRAPI_URL}/api`;

// Tworzy instancję Axios skonfigurowaną do komunikacji ze Strapi
export const strapiAxios = axios.create({
  baseURL: STRAPI_API_URL, // Wszystkie zapytania będą prefixowane tym URL
  headers: {
    "Content-Type": "application/json", // Domyślnie wysyłamy JSON
  },
});

// Interceptor request - automatycznie dodaje token do nagłówków
// Jest to kluczowa funkcja, która sprawia, że nie musimy ręcznie zarządzać tokenami
strapiAxios.interceptors.request.use(
  (config) => {
    // Pobiera token z localStorage
    const token = localStorage.getItem("token");

    // Dodaje token do nagłówka Authorization, ale tylko jeśli:
    // 1. Token istnieje
    // 2. To nie jest zapytanie logowania (które nie potrzebuje tokenu)
    if (token && config.url !== "/auth/local") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor response - obsługuje wygaśnięcie tokenów
// Automatycznie wylogowuje użytkownika gdy token wygaśnie (błąd 401)
strapiAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Jeśli token wygasł (401), automatycznie wyloguj użytkownika
    if (error.response?.status === 401) {
      console.warn("🚨 Token wygasł - automatyczne wylogowanie");

      // Wyczyść token z localStorage
      localStorage.removeItem("token");

      // Wyloguj użytkownika w store
      useAuthStore.getState().logout();

      // Przekieruj na stronę logowania
      if (window.location.pathname !== "/authentication/sign-in") {
        window.location.href = "/authentication/sign-in";
      }
    }

    return Promise.reject(error);
  },
);

// Funkcja obsługująca błędy API - konwertuje błędy Strapi na czytelny format
const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    // Wyciąga strukturę błędu specyficzną dla Strapi
    const strapiError = error.response?.data?.error;
    if (strapiError) {
      // Rzuca błąd z czytelnym komunikatem i dodatkowymi informacjami
      throw {
        message: strapiError.message || "Błąd serwera Strapi",
        details: strapiError.details,
        name: strapiError.name,
        status: error.response?.status,
      };
    }
  }
  // Jeśli to nie jest błąd Strapi, rzuca oryginalny błąd
  throw error;
};
```

---

### **ETAP 2: Pobieranie profilu użytkownika z relacjami**

#### **2.1 Zapytanie do /users/me z populate**

**Plik:** `src/api/authApi.ts` (kontynuacja funkcji `zaloguj`)

**Wyjaśnienie:** To jest kluczowa innowacja w nowym procesie logowania. Zamiast wykonywać oddzielne zapytania do tabel Staff i Supplier, używamy jednego zapytania `/users/me?populate=*`. Parametr `populate=*` instruuje Strapi, aby dołączyło wszystkie powiązane dane (relacje) do odpowiedzi. Dzięki temu w jednym zapytaniu otrzymujemy podstawowe dane użytkownika PLUS jego profil Staff lub Supplier.

```typescript
// 2. Pobiera użytkownika z wszystkimi relacjami w JEDNYM zapytaniu
// To jest znacznie wydajniejsze niż oddzielne zapytania do każdej tabeli
console.log("🔍 Pobieranie /users/me?populate=*...");
const userWithProfile = await strapiAdapter.get<UserWithProfile>(
  "/users/me?populate=*", // populate=* dołącza wszystkie relacje
);

// Loguje podsumowanie otrzymanych danych dla celów debugowania
// Pomaga zrozumieć, jaki typ profilu ma użytkownik
console.log("📊 USER PROFILE SUMMARY:", {
  email: userWithProfile.email,
  hasStaffProfile: !!userWithProfile.staff_profile, // Czy ma profil Staff
  hasSupplierProfile: !!userWithProfile.supplier_profile, // Czy ma profil Supplier
  staffPosition: userWithProfile.staff_profile?.position || "N/A",
  supplierCompany: userWithProfile.supplier_profile?.companyName || "N/A",
});
```

#### **2.2 Definicje typów dla struktury danych**

**Plik:** `src/api/authApi.ts`

**Wyjaśnienie:** Te definicje typów są kluczowe dla bezpieczeństwa typów w TypeScript. `UserWithProfile` rozszerza podstawowy interfejs `StrapiUser` o opcjonalne pola `staff_profile` i `supplier_profile`. Dzięki temu TypeScript może sprawdzić w czasie kompilacji, czy poprawnie obsługujemy różne typy użytkowników. Użycie `?` oznacza, że pola są opcjonalne - użytkownik może mieć profil Staff LUB Supplier, ale nie oba jednocześnie.

```typescript
// Interfejs dla użytkownika z relacjami otrzymanymi z /users/me
// Rozszerza podstawowy StrapiUser o opcjonalne profile
interface UserWithProfile extends StrapiUser {
  staff_profile?: Staff; // Opcjonalny profil Staff (admin lub staff)
  supplier_profile?: Supplier; // Opcjonalny profil Supplier
}

// Enum definiujący możliwe role w aplikacji
// To nie są role Strapi, ale nasze własne role biznesowe
export type AppRole = "admin" | "staff" | "supplier";

// Union type dla profilu użytkownika - może być Staff lub Supplier
export type UserProfile = Staff | Supplier;
```

**Plik:** `src/stores/authStore.ts`

**Wyjaśnienie:** `StrapiUser` to podstawowy interfejs reprezentujący strukturę użytkownika zwracaną przez Strapi. Zawiera standardowe pola jak email, username, daty utworzenia itp. Pole `role` to rola z systemu Users & Permissions Strapi (nie mylić z naszą `AppRole`). Ten interfejs jest fundamentem dla wszystkich operacji związanych z użytkownikami.

```typescript
// Podstawowy interfejs użytkownika zwracany przez Strapi
// Reprezentuje strukturę danych z tabeli users w bazie danych
export interface StrapiUser {
  id: number; // Unikalny identyfikator użytkownika
  username: string; // Nazwa użytkownika
  email: string; // Adres email (używany do logowania)
  provider: string; // Dostawca uwierzytelniania (local, google, etc.)
  confirmed: boolean; // Czy konto zostało potwierdzone
  blocked: boolean; // Czy konto jest zablokowane
  createdAt: string; // Data utworzenia konta
  updatedAt: string; // Data ostatniej aktualizacji
  role: {
    // Rola z systemu Users & Permissions Strapi
    id: number;
    name: string; // np. "Authenticated", "Public"
    description: string;
    type: string;
  };
}
```

---

### **ETAP 3: Określanie roli aplikacji**

#### **3.1 Logika określania roli na podstawie profili**

**Plik:** `src/api/authApi.ts`

**Wyjaśnienie:** To jest serce logiki biznesowej aplikacji. Funkcja `determineAppRole` analizuje profil użytkownika i określa jego rolę w aplikacji. Logika jest hierarchiczna: najpierw sprawdza profil Staff (który może być admin lub staff), a następnie profil Supplier. Każdy krok jest szczegółowo logowany, co ułatwia debugowanie problemów z rolami.

```typescript
function determineAppRole(userWithProfile: UserWithProfile): AppRole {
  // Loguje informacje o profilach dla celów debugowania
  console.log("🎯 DETERMINING APP ROLE:", {
    hasStaffProfile: !!userWithProfile.staff_profile,
    hasSupplierProfile: !!userWithProfile.supplier_profile,
    staffPosition: userWithProfile.staff_profile?.position || "N/A",
  });

  // 1. PRIORYTET: Sprawdza profil Staff
  // Jeśli użytkownik ma profil Staff, jego rola zależy od pola 'position'
  if (userWithProfile.staff_profile && userWithProfile.staff_profile.position) {
    const position = userWithProfile.staff_profile.position.toLowerCase();

    if (position === "admin") {
      console.log("✅ ROLE: admin (from staff.position)");
      return "admin";
    } else if (position === "staff") {
      console.log("✅ ROLE: staff (from staff.position)");
      return "staff";
    } else {
      // Nieznana wartość position - rzuca błąd
      console.warn("⚠️ Unknown staff position:", position);
      throw new Error(`Nieznana rola w polu position: ${position}`);
    }
  }

  // 2. ALTERNATYWA: Sprawdza profil Supplier
  // Jeśli użytkownik ma profil Supplier, zawsze jest to rola "supplier"
  if (userWithProfile.supplier_profile) {
    console.log("✅ ROLE: supplier (from supplier profile)");
    return "supplier";
  }

  // 3. BŁĄD: Brak obu profili
  // Każdy użytkownik MUSI mieć jeden z profili
  throw new Error(
    "Nie można określić roli użytkownika - brak profilu staff lub supplier",
  );
}
```

#### **3.2 Wybór aktywnego profilu**

**Plik:** `src/api/authApi.ts`

**Wyjaśnienie:** Funkcja `getActiveProfile` wybiera aktywny profil użytkownika, który zostanie zapisany w store aplikacji. Profil zawiera szczegółowe informacje o użytkowniku (imię, nazwisko, firma, etc.) i jest używany w całej aplikacji do personalizacji interfejsu. Logika jest prosta: Staff ma priorytet nad Supplier.

```typescript
function getActiveProfile(userWithProfile: UserWithProfile): UserProfile {
  // Sprawdza czy użytkownik ma profil Staff (admin lub staff)
  if (userWithProfile.staff_profile) {
    console.log("📋 ACTIVE PROFILE: staff");
    return userWithProfile.staff_profile; // Zwraca profil Staff
  }

  // Sprawdza czy użytkownik ma profil Supplier
  if (userWithProfile.supplier_profile) {
    console.log("📋 ACTIVE PROFILE: supplier");
    return userWithProfile.supplier_profile; // Zwraca profil Supplier
  }

  // Błąd - brak jakiegokolwiek profilu
  throw new Error("Brak aktywnego profilu użytkownika");
}
```

---

### **ETAP 4: Zapisanie stanu uwierzytelnienia**

#### **4.1 Zustand Store - Zarządzanie stanem**

**Plik:** `src/stores/authStore.ts`

**Wyjaśnienie:** Zustand Store to globalny stan aplikacji, który przechowuje informacje o uwierzytelnieniu. Interfejs `AuthState` definiuje strukturę danych, a `AuthActions` definiuje dostępne operacje. Middleware `persist` automatycznie zapisuje stan w localStorage, dzięki czemu użytkownik pozostaje zalogowany po odświeżeniu strony. Funkcja `partialize` określa, które części stanu mają być zapisane.

```typescript
// Interfejs definiujący strukturę stanu uwierzytelniania
interface AuthState {
  user: StrapiUser | null; // Podstawowe dane użytkownika z Strapi
  token: string | null; // Token JWT do autoryzacji zapytań
  isAuthenticated: boolean; // Czy użytkownik jest zalogowany
  appRole: AppRole | null; // Rola w aplikacji (admin/staff/supplier)
  profile: UserProfile | null; // Szczegółowy profil użytkownika
}

// Interfejs definiujący dostępne akcje
interface AuthActions {
  login: (data: {
    user: StrapiUser;
    token: string;
    appRole: AppRole;
    profile: UserProfile;
  }) => void;
  logout: () => void;
  setUser: (user: StrapiUser) => void;
}

// Tworzenie Auth Store z middleware persist
// Persist automatycznie zapisuje stan w localStorage
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      // Funkcja login zapisuje wszystkie dane uwierzytelniania w store
      login: (data) =>
        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true, // Ustawia flagę uwierzytelniania
          appRole: data.appRole,
          profile: data.profile,
        }),

      // Funkcja logout czyści cały stan uwierzytelniania
      logout: () => {
        console.log("Logging out and clearing auth state.");
        set(initialState); // Resetuje do stanu początkowego
      },

      // Funkcja setUser aktualizuje tylko dane użytkownika
      setUser: (user) =>
        set((state) => ({
          ...state,
          user,
        })),
    }),
    {
      name: "auth-storage", // Klucz w localStorage
      // Określa, które części stanu mają być zapisane w localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        appRole: state.appRole,
        profile: state.profile,
      }),
    },
  ),
);
```

#### **4.2 Finalizacja procesu logowania**

**Plik:** `src/api/authApi.ts` (kontynuacja funkcji `zaloguj`)

**Wyjaśnienie:** To jest finał całego procesu logowania. Wszystkie zebrane dane (token, użytkownik, rola, profil) są zapisywane w Zustand Store za pomocą akcji `login`. Od tego momentu aplikacja "wie", że użytkownik jest zalogowany i może wyświetlać odpowiedni interfejs. Funkcja zwraca obiekt z wynikiem, który jest używany w komponencie do przekierowania użytkownika.

```typescript
// 3. Określa rolę aplikacji na podstawie analizy profilu
const appRole = determineAppRole(userWithProfile);
const profile = getActiveProfile(userWithProfile);

// 4. Zapisuje wszystkie dane uwierzytelniania w globalnym store
// Od tego momentu aplikacja "wie", że użytkownik jest zalogowany
useAuthStore.getState().login({ user, token: jwt, appRole, profile });

// Loguje podsumowanie pomyślnego logowania
console.log("🎉 LOGOWANIE ZAKOŃCZONE SUKCESEM:", {
  email: user.email,
  appRole,
  profileType: userWithProfile.staff_profile ? "staff" : "supplier",
});

// Zwraca wynik logowania do komponentu UI
return { success: true, jwt, user, appRole, profile };
```

---

## 🔧 Konfiguracja Backend (Strapi v5)

### **Backend 1: Konfiguracja Content Types**

#### **User Content Type (rozszerzony)**

**Plik:** `strapi-backend/src/extensions/users-permissions/content-types/user/schema.json`

**Wyjaśnienie:** To jest rozszerzenie standardowego Content Type User w Strapi. Dodajemy dwa nowe pola relacyjne: `staff_profile` i `supplier_profile`. Relacje typu `oneToOne` oznaczają, że jeden użytkownik może mieć maksymalnie jeden profil Staff i jeden profil Supplier. W praktyce użytkownik ma tylko jeden z tych profili, ale struktura pozwala na elastyczność.

```json
{
  "kind": "collectionType",
  "collectionName": "up_users",
  "info": {
    "name": "user",
    "description": "",
    "singularName": "user",
    "pluralName": "users",
    "displayName": "User"
  },
  "options": {
    "draftAndPublish": false // Wyłącza system draft/publish dla użytkowników
  },
  "attributes": {
    "username": {
      "type": "string",
      "minLength": 3,
      "unique": true,
      "configurable": false,
      "required": true
    },
    "email": {
      "type": "email",
      "minLength": 6,
      "configurable": false,
      "required": true
    },
    "password": {
      "type": "password",
      "minLength": 6,
      "configurable": false,
      "private": true, // Hasło nie jest zwracane w API
      "searchable": false // Hasło nie jest przeszukiwalne
    },
    "role": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.role",
      "inversedBy": "users",
      "configurable": false
    },
    // NOWE POLA RELACYJNE:
    "staff_profile": {
      "type": "relation",
      "relation": "oneToOne", // Jeden użytkownik = jeden profil Staff
      "target": "api::staff.staff" // Wskazuje na Content Type Staff
    },
    "supplier_profile": {
      "type": "relation",
      "relation": "oneToOne", // Jeden użytkownik = jeden profil Supplier
      "target": "api::supplier.supplier" // Wskazuje na Content Type Supplier
    }
  }
}
```

#### **Staff Content Type**

**Plik:** `strapi-backend/src/api/staff/content-types/staff/schema.json`

**Wyjaśnienie:** Content Type Staff reprezentuje pracowników firmy. Kluczowe pole to `position`, które określa czy pracownik jest administratorem czy zwykłym pracownikiem. Pole `staffId` jest prywatne i może być używane do wewnętrznej identyfikacji. Relacja `user` łączy profil Staff z kontem użytkownika w systemie.

```json
{
  "kind": "collectionType",
  "collectionName": "staffs",
  "info": {
    "singularName": "staff",
    "pluralName": "staffs",
    "displayName": "Staff"
  },
  "options": {
    "comment": ""
  },
  "attributes": {
    "staffId": {
      "type": "string",
      "unique": false,
      "configurable": false,
      "private": true // Pole prywatne - nie zwracane w API
    },
    "firstName": {
      "type": "string",
      "required": true
    },
    "lastName": {
      "type": "string",
      "required": true
    },
    "email": {
      "type": "email",
      "required": true,
      "unique": true // Email musi być unikalny
    },
    "phone": {
      "type": "string" // Opcjonalny numer telefonu
    },
    "position": {
      "type": "enumeration",
      "enum": ["admin", "staff"], // KLUCZOWE: określa rolę w aplikacji
      "required": true
    },
    "user": {
      "type": "relation",
      "relation": "oneToOne", // Jeden profil Staff = jeden użytkownik
      "target": "plugin::users-permissions.user"
    }
  }
}
```

#### **Supplier Content Type**

**Plik:** `strapi-backend/src/api/supplier/content-types/supplier/schema.json`

**Wyjaśnienie:** Content Type Supplier reprezentuje dostawców/firmy zewnętrzne. Zawiera informacje o firmie (nazwa, NIP) oraz dane kontaktowe. Brak pola `position` oznacza, że wszyscy dostawcy mają tę samą rolę w aplikacji. Pole `nip` musi być unikalne, co zapewnia, że jedna firma nie może mieć wielu kont.

```json
{
  "kind": "collectionType",
  "collectionName": "suppliers",
  "info": {
    "singularName": "supplier",
    "pluralName": "suppliers",
    "displayName": "Supplier"
  },
  "options": {
    "comment": ""
  },
  "attributes": {
    "supplierId": {
      "type": "string",
      "unique": false,
      "configurable": false,
      "private": true // Pole prywatne - wewnętrzna identyfikacja
    },
    "companyName": {
      "type": "string",
      "required": true // Nazwa firmy jest wymagana
    },
    "nip": {
      "type": "string",
      "required": true,
      "unique": true // NIP musi być unikalny
    },
    "email": {
      "type": "email",
      "required": true,
      "unique": true // Email firmowy musi być unikalny
    },
    "contactFirstName": {
      "type": "string" // Opcjonalne imię osoby kontaktowej
    },
    "contactLastName": {
      "type": "string" // Opcjonalne nazwisko osoby kontaktowej
    },
    "user": {
      "type": "relation",
      "relation": "oneToOne", // Jeden profil Supplier = jeden użytkownik
      "target": "plugin::users-permissions.user"
    }
  }
}
```

### **Backend 2: Konfiguracja uprawnień**

#### **Uprawnienia dla roli Public**

**Wyjaśnienie:** Rola Public to niezalogowani użytkownicy. Mają dostęp tylko do endpointów niezbędnych do logowania i rejestracji. Dostęp do danych Supplier jest dozwolony, ponieważ może być potrzebny podczas procesu rejestracji. Dostęp do danych Staff jest zabroniony ze względów bezpieczeństwa.

```
Settings → Users & Permissions Plugin → Roles → Public
- Users-permissions → AUTH: connect, forgotPassword, resetPassword, register
  (Endpointy do logowania, resetowania hasła i rejestracji)
- Supplier → Find ✅, FindOne ✅ (Potrzebne do procesu rejestracji dostawców)
- Staff → Find ❌, FindOne ❌ (Dane pracowników są poufne)
```

#### **Uprawnienia dla roli Authenticated**

**Wyjaśnienie:** Rola Authenticated to zalogowani użytkownicy. Mają dostęp do podstawowych endpointów Users & Permissions (w tym `/users/me`) oraz do odczytu danych Staff i Supplier. Te uprawnienia są niezbędne do funkcjonowania procesu logowania i podstawowych funkcji aplikacji.

```
Settings → Users & Permissions Plugin → Roles → Authenticated
- Users-permissions → find, findOne, me ✅
  (Dostęp do własnych danych użytkownika, kluczowe dla /users/me)
- Staff → Find ✅, FindOne ✅
  (Dostęp do danych pracowników dla zalogowanych użytkowników)
- Supplier → Find ✅, FindOne ✅
  (Dostęp do danych dostawców dla zalogowanych użytkowników)
```

#### **Dodatkowe role**

**Wyjaśnienie:** To są dodatkowe role biznesowe, które można utworzyć w Strapi do bardziej granularnego zarządzania uprawnieniami. Każda rola może mieć różne uprawnienia do różnych Content Types, co pozwala na precyzyjne kontrolowanie dostępu do danych.

```
Settings → Users & Permissions Plugin → Roles
- admin: "Rola dla administratorów"
  (Pełne uprawnienia do wszystkich Content Types)
- staff: "Rola dla pracowników"
  (Ograniczone uprawnienia, np. tylko odczyt niektórych danych)
- supplier: "Rola dla dostawców"
  (Dostęp tylko do własnych danych i funkcji związanych z dostawami)
```

---

## 🛡️ Komponenty Zabezpieczeń

### **Protected Routes**

**Plik:** `src/components/authentication/ProtectedRoute.tsx`

**Wyjaśnienie:** Komponent `ProtectedRoute` to Higher-Order Component, który chroni trasy przed nieautoryzowanym dostępem. Sprawdza czy użytkownik jest zalogowany i czy ma odpowiednią rolę. Jeśli nie jest zalogowany, przekierowuje na stronę logowania. Jeśli nie ma wymaganej roli, przekierowuje na stronę "brak uprawnień".

```typescript
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;      // Komponenty do wyświetlenia jeśli dostęp jest dozwolony
  requiredRole?: AppRole;         // Opcjonalna wymagana rola
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  // Pobiera stan uwierzytelniania z globalnego store
  const { isAuthenticated, appRole } = useAuthStore();

  // PIERWSZA KONTROLA: Czy użytkownik jest zalogowany?
  if (!isAuthenticated) {
    // Przekierowuje na stronę logowania z flagą replace
    // (nie dodaje do historii przeglądarki)
    return <Navigate to="/authentication/sign-in" replace />;
  }

  // DRUGA KONTROLA: Czy użytkownik ma wymaganą rolę?
  if (requiredRole && appRole !== requiredRole) {
    // Przekierowuje na stronę "brak uprawnień"
    return <Navigate to="/unauthorized" replace />;
  }

  // Jeśli wszystkie kontrole przeszły, wyświetla chronioną zawartość
  return <>{children}</>;
};
```

### **Role-Based Redirects**

**Plik:** `src/components/authentication/RoleBasedRedirect.tsx`

**Wyjaśnienie:** Komponent `RoleBasedRedirect` automatycznie przekierowuje zalogowanych użytkowników na odpowiedni dashboard w zależności od ich roli. Jest używany na stronie głównej lub po zalogowaniu. Hook `useEffect` reaguje na zmiany w stanie uwierzytelniania i wykonuje przekierowanie.

```typescript
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export const RoleBasedRedirect: React.FC = () => {
  // Pobiera stan uwierzytelniania i funkcję nawigacji
  const { appRole, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Hook useEffect reaguje na zmiany w stanie uwierzytelniania
  useEffect(() => {
    // Sprawdza czy użytkownik jest zalogowany i ma rolę
    if (isAuthenticated && appRole) {
      // Przekierowuje na odpowiedni dashboard w zależności od roli
      switch (appRole) {
        case "admin":
          navigate("/admin/dashboard"); // Panel administratora
          break;
        case "staff":
          navigate("/staff/dashboard"); // Panel pracownika
          break;
        case "supplier":
          navigate("/supplier/dashboard"); // Panel dostawcy
          break;
        default:
          navigate("/"); // Strona główna jako fallback
      }
    }
  }, [appRole, isAuthenticated, navigate]); // Zależności - hook uruchamia się gdy się zmieniają

  // Komponent nie renderuje żadnej zawartości, tylko wykonuje przekierowanie
  return null;
};
```

---

## 🧪 Przykłady Użycia

### **Sprawdzanie roli w komponencie**

**Wyjaśnienie:** Ten przykład pokazuje, jak używać stanu uwierzytelniania w komponencie React. Hook `useAuthStore` pobiera dane z globalnego store. Komponent może sprawdzać rolę użytkownika i wyświetlać różną zawartość w zależności od uprawnień. To jest typowy wzorzec w aplikacjach z kontrolą dostępu opartą na rolach.

```typescript
import { useAuthStore } from "@/stores/authStore";

export const SomeComponent: React.FC = () => {
  // Pobiera stan uwierzytelniania z globalnego store
  const { appRole, profile, isAuthenticated } = useAuthStore();

  // Sprawdza czy użytkownik jest zalogowany
  if (!isAuthenticated) {
    return <div>Zaloguj się</div>;
  }

  return (
    <div>
      {/* Personalizowany nagłówek w zależności od typu profilu */}
      <h1>Witaj, {profile?.firstName || profile?.companyName}!</h1>
      <p>Twoja rola: {appRole}</p>

      {/* Warunkowe wyświetlanie elementów w zależności od roli */}
      {appRole === "admin" && (
        <button>Panel administratora</button>
      )}

      {appRole === "supplier" && (
        <button>Dodaj dostawę</button>
      )}
    </div>
  );
};
```

### **Wylogowanie**

**Plik:** `src/api/authApi.ts`

**Wyjaśnienie:** Funkcja `wyloguj` czyści wszystkie dane uwierzytelniania. Usuwa token z localStorage (aby uniemożliwić dalsze zapytania API) i wywołuje akcję `logout` w store (aby wyczyścić stan aplikacji). Po wylogowaniu użytkownik zostanie automatycznie przekierowany na stronę logowania przez Protected Routes.

```typescript
export const wyloguj = async (): Promise<{ success: boolean }> => {
  // Usuwa token JWT z localStorage przeglądarki
  // Bez tokenu użytkownik nie może wykonywać autoryzowanych zapytań
  localStorage.removeItem("token");

  // Wywołuje akcję logout w globalnym store
  // Czyści wszystkie dane uwierzytelniania (user, profile, role, etc.)
  useAuthStore.getState().logout();

  // Zwraca informację o pomyślnym wylogowaniu
  return { success: true };
};
```

---

## 📊 Różnice między typami użytkowników

### **Admin (`admin@msbox.com`)**

**Wyjaśnienie:** Administrator to najwyższa rola w systemie. Ma profil Staff z `position: "admin"`, co daje mu pełne uprawnienia do wszystkich funkcji aplikacji. Może zarządzać użytkownikami, przeglądać raporty i mieć dostęp do wszystkich danych w systemie.

- **Profil:** Staff z `position: "admin"`
- **Uprawnienia:** Pełne (wszystkie Content Types)
- **Dashboard:** `/admin/dashboard`
- **Funkcje:** Zarządzanie użytkownikami, raporty, pełny dostęp

### **Staff (`staff@msbox.com`)**

**Wyjaśnienie:** Pracownik to rola średniego szczebla. Ma profil Staff z `position: "staff"`, co daje mu ograniczone uprawnienia. Może wykonywać codzienne zadania, ale nie ma dostępu do funkcji administracyjnych.

- **Profil:** Staff z `position: "staff"`
- **Uprawnienia:** Ograniczone (tylko odczyt niektórych danych)
- **Dashboard:** `/staff/dashboard`
- **Funkcje:** Przeglądanie dostaw, zadania

### **Supplier (`supplier@msbox.com`)**

**Wyjaśnienie:** Dostawca to rola zewnętrzna. Ma profil Supplier (bez pola position), co oznacza, że ma dostęp tylko do funkcji związanych z dostawami. Nie może przeglądać danych innych dostawców ani danych wewnętrznych firmy.

- **Profil:** Supplier (bez pola position)
- **Uprawnienia:** Tylko własne dane
- **Dashboard:** `/supplier/dashboard`
- **Funkcje:** Dodawanie dostaw, przeglądanie własnych danych

---

## 🔍 Debugowanie

### **Logi konsoli podczas logowania**

**Wyjaśnienie:** System logowania generuje szczegółowe logi w konsoli przeglądarki, które pomagają w debugowaniu problemów. Każdy etap procesu jest logowany z odpowiednimi emotikonami i informacjami. Dzięki temu można łatwo zidentyfikować, na którym etapie wystąpił problem.

```
🚀 ROZPOCZĘCIE LOGOWANIA: supplier@msbox.com
  (Początek procesu logowania)
✅ TOKEN ZAPISANY, pobieranie profilu użytkownika...
  (Token JWT został pomyślnie otrzymany i zapisany)
🔍 Pobieranie /users/me?populate=*...
  (Rozpoczęcie zapytania o profil użytkownika)
📊 USER PROFILE SUMMARY: {
  email: "supplier@msbox.com",
  hasStaffProfile: false,
  hasSupplierProfile: true,
  staffPosition: "N/A",
  supplierCompany: "Test Company"
}
  (Podsumowanie otrzymanych danych profilu)
🎯 DETERMINING APP ROLE: {
  hasStaffProfile: false,
  hasSupplierProfile: true,
  staffPosition: "N/A"
}
  (Analiza profilu w celu określenia roli)
✅ ROLE: supplier (from supplier profile)
  (Rola została pomyślnie określona)
📋 ACTIVE PROFILE: supplier
  (Wybrano aktywny profil)
🎉 LOGOWANIE ZAKOŃCZONE SUKCESEM: {
  email: "supplier@msbox.com",
  appRole: "supplier",
  profileType: "supplier"
}
  (Podsumowanie pomyślnego logowania)
```

### **Najczęstsze problemy**

**Wyjaśnienie:** Te problemy występują najczęściej podczas wdrażania lub debugowania systemu logowania. Każdy problem ma jasną przyczynę i rozwiązanie.

1. **403 Forbidden na /users/me**
   - **Przyczyna:** Brak tokenu lub nieprawidłowy token w nagłówku Authorization
   - **Rozwiązanie:** Sprawdź czy token jest zapisany w localStorage i czy interceptor w strapiAdapter działa poprawnie

2. **Invalid key w populate**
   - **Przyczyna:** Nieprawidłowe nazwy relacji w zapytaniu populate
   - **Rozwiązanie:** Sprawdź nazwy relacji w Content Types i użyj `populate=*` zamiast konkretnych nazw

3. **Błędne przekierowanie**
   - **Przyczyna:** Błąd w logice określania roli lub nieprawidłowa konfiguracja ról
   - **Rozwiązanie:** Sprawdź logikę w `determineAppRole` i konfigurację ról w Strapi

---

## 🎯 Podsumowanie

Nowy proces logowania to **eleganckie rozwiązanie** które:

1. ✅ **Wykorzystuje Strapi v5** z gotowym systemem uwierzytelniania
   - Nie wymaga własnej implementacji JWT, hashowania haseł, etc.
2. ✅ **Jeden request** `/users/me?populate=*` zamiast wielu zapytań
   - Znacznie wydajniejsze i szybsze
3. ✅ **Bezpieczne** - wykorzystuje relacje i uprawnienia Strapi
   - Korzysta z sprawdzonych mechanizmów bezpieczeństwa
4. ✅ **Długi czas życia tokenów** - 30 dni bez konieczności ponownego logowania
   - Eliminuje potrzebę refresh tokenów
5. ✅ **Automatyczne wylogowanie** - gdy token wygaśnie po 30 dniach
   - Graceful handling wygaśnięcia sesji
6. ✅ **Skalowalne** - łatwe dodawanie nowych ról
   - Wystarczy dodać nowy Content Type i rozszerzyć logikę
7. ✅ **Debugowalne** - szczegółowe logi w każdym kroku
   - Łatwe identyfikowanie i rozwiązywanie problemów

### **Konfiguracja tokenów JWT:**

- **Czas życia:** 30 dni (`expiresIn: '30d'`)
- **Automatyczne wylogowanie:** Po wygaśnięciu tokenu
- **Brak refresh tokenów:** Nie są potrzebne przy długim czasie życia
- **Rate limiting:** Maksymalnie 5 prób logowania na minutę

Proces jest **stabilny, wydajny i łatwy do utrzymania**! 🚀
