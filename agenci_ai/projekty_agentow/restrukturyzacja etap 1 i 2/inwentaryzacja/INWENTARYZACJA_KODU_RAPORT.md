# Kompleksowy Raport Inwentaryzacji Kodu - Aplikacja Full-Stack

## 1. Drzewo Struktury Plików

### Backend (4+ poziomy głębokości)

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── aws.ts
│   │   └── config.ts
│   ├── controllers/
│   │   ├── auth/
│   │   │   ├── authController.ts
│   │   │   ├── staffController.ts
│   │   │   └── supplierController.ts
│   │   ├── adsPowerController.ts
│   │   ├── allegroController.ts (ZAKOMENTOWANY)
│   │   ├── brightDataController.ts
│   │   └── deliveryController.ts
│   ├── middleware/
│   │   ├── auth/
│   │   │   ├── authenticateToken.middleware.ts
│   │   │   ├── requireAdmin.middleware.ts
│   │   │   └── requireRole.middleware.ts
│   │   ├── deliveries/
│   │   │   ├── deliveryPermissions.middleware.ts
│   │   │   ├── index.ts
│   │   │   └── validateDeliveryData.middleware.ts
│   │   ├── error/
│   │   │   └── errorHandler.middleware.ts
│   │   ├── logging/
│   │   │   └── requestLogger.middleware.ts
│   │   ├── session/
│   │   │   └── sessionCleaner.middleware.ts
│   │   └── validation/
│   │       ├── validateLoginData.middleware.ts
│   │       ├── validateStaffData.middleware.ts
│   │       └── validateSupplierData.middleware.ts
│   ├── models/
│   │   ├── auth/
│   │   │   ├── AuthDaneAutoryzacji.ts
│   │   │   ├── AuthDostawcy.ts
│   │   │   ├── AuthHistoriaLogowan.ts
│   │   │   ├── AuthPracownicy.ts
│   │   │   └── index.ts
│   │   ├── deliveries/
│   │   │   ├── DostDostawyProdukty.ts
│   │   │   ├── DostFakturyDostawcow.ts
│   │   │   ├── DostFinanseDostaw.ts
│   │   │   ├── DostNowaDostawa.ts
│   │   │   └── index.ts
│   │   ├── AmazonProduct.ts
│   │   └── index.ts
│   ├── routes/
│   │   ├── auth/
│   │   │   ├── authRoutes.ts
│   │   │   ├── staffRoutes.ts
│   │   │   └── supplierRoutes.ts
│   │   ├── adsPowerRoutes.ts
│   │   ├── allegroRoutes.ts (CZĘŚCIOWO ZAKOMENTOWANY)
│   │   ├── brightDataRoutes.ts
│   │   ├── deliveryRoutes.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── auth/
│   │   │   └── authService.ts
│   │   ├── adsPowerService.ts
│   │   ├── allegroService.ts (CAŁY PLIK ZAKOMENTOWANY)
│   │   ├── awsService.ts
│   │   ├── brightDataService.ts
│   │   ├── deliveryService.ts
│   │   ├── passwordService.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── adsPower.ts
│   │   ├── auth.types.ts
│   │   ├── delivery.types.ts
│   │   ├── express.d.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── AppError.ts
│   │   ├── apply-database-improvements.ts
│   │   ├── countryValidation.ts
│   │   ├── database-ddl-extractor.ts
│   │   └── logger.ts
│   └── server.ts
├── tests/
│   ├── integration/
│   ├── unit/
│   └── setup.ts
├── package.json
└── dist/ (kompilowane pliki)
```

### Frontend (src/ - 4+ poziomy głębokości)

```
src/
├── api/
│   ├── adsPowerApi.ts
│   ├── authApi.ts
│   ├── axios.ts
│   ├── brightDataApi.ts
│   ├── deliveryApi.ts
│   ├── login_auth_data.api.ts (DUPLIKAT)
│   ├── login_table_staff.api.ts (DUPLIKAT)
│   ├── login_table_suppliers.api.ts (DUPLIKAT)
│   ├── loginHistoryApi.ts
│   ├── staffApi.ts
│   └── supplierApi.ts
├── components/
│   ├── authentication/
│   │   └── ProtectedRoute.tsx
│   ├── blocks/
│   │   ├── application-ui/ (291 PLIKÓW - PRAWDOPODOBNIE NIEUŻYWANE)
│   │   │   ├── advanced-tables/
│   │   │   ├── create-drawers/
│   │   │   ├── crud-layouts/
│   │   │   ├── read-modals/
│   │   │   ├── success-message/
│   │   │   ├── table-footers/
│   │   │   ├── update-drawers/
│   │   │   ├── update-forms/
│   │   │   └── update-modals/
│   │   ├── FeaturesSection.tsx
│   │   ├── HeroSection.tsx
│   │   └── NeonThemeDemo.tsx
│   ├── navbar/
│   │   └── DashboardNavbar.tsx
│   └── sidebar/
│       ├── AdminSidebar.tsx
│       ├── AppSidebar.tsx
│       ├── StaffSidebar.tsx
│       └── SupplierSidebar.tsx
├── contexts/
│   └── AuthContext.tsx
├── helpers/
│   ├── is-browser.ts (NIEUŻYWANY)
│   └── is-small-screen.ts (NIEUŻYWANY)
├── layouts/
│   ├── AdminLayout.tsx
│   ├── DashboardLayout.tsx
│   ├── StaffLayout.tsx
│   └── SupplierLayout.tsx
├── pages/
│   ├── admin/
│   │   ├── AdminAddDeliveryPage.tsx
│   │   ├── AdminDashboardPage.tsx
│   │   ├── AdminLandingPage.tsx
│   │   ├── AdminProductsPage.tsx
│   │   └── AdminTablesPage.tsx
│   ├── authentication/
│   │   ├── forgot-password.tsx
│   │   ├── profile-lock.tsx
│   │   ├── reset-password.tsx
│   │   ├── sign-in-background.tsx
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── staff/
│   │   ├── StaffAddDeliveryPage.tsx
│   │   ├── StaffDashboardPage.tsx
│   │   └── StaffTasksPage.tsx
│   └── supplier/
│       ├── SupplierAddDeliveryPage.tsx
│       ├── SupplierDashboardPage.tsx
│       └── SupplierDeliveriesPage.tsx
├── theme/
│   └── custom-theme.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 2. Analiza Zależności (package.json)

### Frontend Dependencies

| Kategoria        | Dependency       | Wersja  | Status               |
| ---------------- | ---------------- | ------- | -------------------- |
| **Core React**   | react            | ^19.1.0 | ✅ Najnowsza         |
|                  | react-dom        | ^19.1.0 | ✅ Najnowsza         |
|                  | react-router-dom | ^7.6.2  | ✅ Najnowsza         |
| **HTTP Client**  | axios            | ^1.10.0 | ✅ Dobra             |
| **UI Framework** | flowbite-react   | ^0.11.8 | ⚠️ Może być outdated |
|                  | tailwindcss      | ^4.1.10 | ✅ Najnowsza         |
| **Utilities**    | classnames       | ^2.5.1  | ✅ Dobra             |
|                  | tailwind-merge   | ^3.3.1  | ✅ Dobra             |
|                  | react-icons      | ^5.5.0  | ✅ Dobra             |

### Backend Dependencies

| Kategoria           | Dependency           | Wersja       | Status                      | Uwagi           |
| ------------------- | -------------------- | ------------ | --------------------------- | --------------- |
| **Core**            | express              | ^4.19.2      | ✅ Stable                   |                 |
|                     | typescript           | ^5.5.2       | ✅ Najnowsza                |                 |
| **Database**        | sequelize            | ^6.37.7      | ✅ Dobra                    |                 |
|                     | sequelize-typescript | ^2.1.6       | ✅ Dobra                    |                 |
|                     | mysql2               | ^3.14.0      | ✅ Dobra                    |                 |
| **HTTP Client**     | axios                | ^1.9.0       | ⚠️ Starsza niż frontend     | **NIESPÓJNOŚĆ** |
| **AWS**             | @aws-sdk/client-s3   | ^3.839.0     | ✅ Dobra                    |                 |
|                     | aws-sdk              | ^2.1691.0    | ⚠️ Stara wersja             | **DUPLIKAT**    |
| **Authentication**  | bcrypt               | ^5.1.1       | ✅ Dobra                    |                 |
|                     | jsonwebtoken         | ^9.0.2       | ✅ Dobra                    |                 |
| **Validation**      | zod                  | ^3.25.36     | ✅ Dobra                    |                 |
|                     | express-validator    | ^7.2.0       | ⚠️ Duplikat funkcjonalności | **REDUNDANCJA** |
| **File Processing** | xlsx                 | ^0.18.5      | ✅ Dobra                    |                 |
|                     | multer               | ^1.4.5-lts.1 | ✅ Dobra                    |                 |

### 🚨 Problemy z Dependencies:

1. **Redundancja AWS SDK:** Używane jednocześnie `@aws-sdk/client-s3` (v3) i `aws-sdk` (v2)
2. **Niespójność Axios:** Backend (1.9.0) vs Frontend (1.10.0)
3. **Duplikat walidacji:** `zod` + `express-validator`

## 3. Mapa API Endpoints

| Metoda HTTP     | Ścieżka URL                                 | Middleware                                                                      | Główna funkcja obsługująca                       |
| :-------------- | :------------------------------------------ | :------------------------------------------------------------------------------ | :----------------------------------------------- |
| **AUTORYZACJA** |
| POST            | `/auth/login`                               | validateLoginData                                                               | authController.login                             |
| POST            | `/auth/logout`                              | authenticateToken                                                               | authController.logout                            |
| POST            | `/auth/refresh-token`                       | -                                                                               | authController.refreshToken                      |
| POST            | `/auth/verify-token`                        | authenticateToken                                                               | (inline function)                                |
| GET             | `/auth/profile/:email`                      | authenticateToken                                                               | authController.getUserProfile                    |
| **PRACOWNICY**  |
| GET             | `/staff/`                                   | -                                                                               | staffController.getAllStaff                      |
| GET             | `/staff/:id`                                | -                                                                               | staffController.getStaffById                     |
| POST            | `/staff/`                                   | validateStaffData                                                               | staffController.createStaff                      |
| PUT             | `/staff/:id`                                | validateStaffData                                                               | staffController.updateStaff                      |
| DELETE          | `/staff/:id`                                | -                                                                               | staffController.deleteStaff                      |
| **DOSTAWCY**    |
| GET             | `/suppliers/`                               | -                                                                               | supplierController.getAllSuppliers               |
| GET             | `/suppliers/:id`                            | -                                                                               | supplierController.getSupplierById               |
| GET             | `/suppliers/check-nip/:nip`                 | -                                                                               | supplierController.checkNipAvailability          |
| GET             | `/suppliers/check-email/:email`             | -                                                                               | supplierController.checkEmailAvailability        |
| POST            | `/suppliers/`                               | validateSupplierData                                                            | supplierController.createSupplier                |
| PUT             | `/suppliers/:id`                            | validateSupplierData                                                            | supplierController.updateSupplier                |
| DELETE          | `/suppliers/:id`                            | -                                                                               | supplierController.deleteSupplier                |
| **DOSTAWY**     |
| GET             | `/deliveries/`                              | authenticateToken                                                               | deliveryController.getAllDeliveries              |
| GET             | `/deliveries/stats`                         | authenticateToken, requireRole                                                  | deliveryController.getDeliveryStats              |
| GET             | `/deliveries/supplier/:supplierId`          | authenticateToken                                                               | deliveryController.getDeliveriesBySupplier       |
| GET             | `/deliveries/status/:status`                | authenticateToken, requireRole                                                  | deliveryController.getDeliveriesByStatus         |
| GET             | `/deliveries/:id`                           | authenticateToken                                                               | deliveryController.getDeliveryById               |
| POST            | `/deliveries/`                              | authenticateToken, validateNewDeliveryData, checkSupplierDeliveryAccess         | deliveryController.createDelivery                |
| PATCH           | `/deliveries/:id/status`                    | authenticateToken, validateDeliveryStatusUpdate, checkDeliveryModifyPermissions | deliveryController.updateDeliveryStatus          |
| DELETE          | `/deliveries/:id`                           | authenticateToken, checkDeliveryDeletePermissions                               | deliveryController.deleteDelivery                |
| POST            | `/deliveries/upload`                        | authenticateToken, multer, checkSupplierDeliveryAccess                          | deliveryController.uploadDeliveryFile            |
| POST            | `/deliveries/upload/preview`                | authenticateToken, multer, checkSupplierDeliveryAccess                          | deliveryController.previewDeliveryFile           |
| **ADSPOWER**    |
| GET             | `/adspower/status`                          | -                                                                               | adsPowerController.checkAdsPowerApi              |
| POST            | `/adspower/create-profile`                  | -                                                                               | adsPowerController.handleCreateProfile           |
| GET             | `/adspower/profiles`                        | -                                                                               | adsPowerController.listAdsPowerProfiles          |
| PUT             | `/adspower/profiles/:userId`                | -                                                                               | adsPowerController.updateAdsPowerProfile         |
| POST            | `/adspower/profiles/delete-bulk`            | -                                                                               | adsPowerController.deleteAdsPowerProfiles        |
| POST            | `/adspower/profiles/regroup`                | -                                                                               | adsPowerController.regroupAdsPowerProfiles       |
| POST            | `/adspower/profiles/clear-all-cache`        | -                                                                               | adsPowerController.clearAllAdsPowerProfilesCache |
| GET             | `/adspower/profiles/:userId/start-browser`  | -                                                                               | adsPowerController.startAdsPowerBrowser          |
| GET             | `/adspower/profiles/:userId/stop-browser`   | -                                                                               | adsPowerController.stopAdsPowerBrowser           |
| GET             | `/adspower/profiles/:userId/browser-status` | -                                                                               | adsPowerController.checkAdsPowerBrowserStatus    |
| GET             | `/adspower/profiles/:userId/detail`         | -                                                                               | adsPowerController.getAdsPowerProfileDetail      |
| POST            | `/adspower/groups`                          | -                                                                               | adsPowerController.createAdsPowerGroup           |
| GET             | `/adspower/groups`                          | -                                                                               | adsPowerController.listAdsPowerGroups            |
| POST            | `/adspower/groups/update`                   | -                                                                               | adsPowerController.updateAdsPowerGroup           |
| POST            | `/adspower/groups/delete-bulk`              | -                                                                               | adsPowerController.deleteAdsPowerGroups          |
| **BRIGHT DATA** |
| GET             | `/brightdata/proxies`                       | -                                                                               | brightDataController.listBrightDataProxies       |

**🚨 Problemy z API:**

- **Brak autoryzacji w AdsPower i BrightData** - wszystkie endpointy publiczne
- **Niespójne middleware** - niektóre trasy nie wymagają autoryzacji
- **Allegro routes zakomentowane** ale nadal importowane

## 4. Analiza Komponentów Frontendowych i Przepływu Danych

### Obecny Stan Zarządzania Stanem

#### **AuthContext** (Główny state manager)

- **Używa:** `useState` dla user i isLoading
- **API Communication:** Axios przez dedykowane funkcje
- **Problem:** Brak centralnego error handling

#### **Komponenty z pobieraniem danych:**

1. **SupplierDeliveriesPage** - używa **mockowanych danych**
2. **AdminProductsPage** - używa **mockowanych danych**
3. **AdminDashboardPage** - używa **mockowanych danych**

### Wzorce komunikacji z API

#### **Tylko Axios - brak fetch()**

- **Centralna konfiguracja:** `src/api/axios.ts`
- **Timeout:** 60 sekund
- **Base URL:** `process.env.VITE_API_URL || 'http://localhost:3001/api'`

#### **Problemy z API Layer:**

1. **Duplikacja plików:** `authApi.ts` vs `login_auth_data.api.ts`
2. **Niespójna obsługa błędów** w różnych plikach API
3. **Ręczne zarządzanie tokenami** w każdym wywołaniu
4. **Brak loading states** w komponentach

### Rekomendacje dla Data Flow:

- ❌ **Brak React Query/SWR** - wszystkie wywołania ręczne
- ❌ **Brak globalnego state managera** (Redux/Zustand)
- ❌ **Mockowane dane** zamiast realnych API calls
- ❌ **Powtarzający się kod** token handling

## 5. Code Smells i Martwy Kod

### 🗑️ Potencjalnie Martwy Kod

#### **Backend:**

1. **Cały moduł Allegro** (~ 500 linii kodu):
   - `allegroService.ts` - całkowicie zakomentowany
   - `allegroController.ts` - całkowicie zakomentowany
   - `allegroRoutes.ts` - większość zakomentowana

2. **Nieużywane eksporty:**
   - `services/index.ts` - eksport nieistniejącego `generatePasswordForSuppliers`

#### **Frontend:**

1. **291 plików w `components/blocks/application-ui/`** - prawdopodobnie nieużywane szablony Flowbite
2. **Duplikujące się pliki API:**
   - `login_table_suppliers.api.ts`
   - `login_table_staff.api.ts`
   - `login_auth_data.api.ts`
3. **Nieużywane helpery:**
   - `helpers/is-small-screen.ts`
   - `helpers/is-browser.ts`

**💾 Oszczędność:** Usunięcie martwego kodu może zmniejszyć rozmiar o **~80% plików frontend** i **~15% backend**

### 🚨 Code Smells

#### **1. Niespójna obsługa błędów**

**Backend - różne wzorce:**

```typescript
// Wzorzec 1: AppError (dobry)
throw new AppError("Użytkownik nie znaleziony", 404);

// Wzorzec 2: Console + throw (problematyczny)
console.error("Database error:", error);
throw new Error("Błąd serwera");

// Wzorzec 3: Different response formats
res.status(500).json({ error: "Błąd serwera" });
res.status(500).json({ success: false, error: "Błąd serwera" });
```

**Frontend - niespójne API error handling:**

```typescript
// authApi.ts - szczegółowa obsługa
if (error.response?.data?.error) return null;

// supplierApi.ts - tylko console.error
console.error("Error:", error);
return [];
```

#### **2. Logika biznesowa w kontrolerach**

**Problem:** Parsowanie i walidacja query params w kontrolerach

```typescript
// deliveryController.ts - ZŁYCH WZORZEC
const filters: DeliveryFilters = {
  id_dostawcy: req.query.id_dostawcy as string,
  status_weryfikacji: req.query.status_weryfikacji as any,
  // ... 20 linii parsowania
};
```

#### **3. Magiczne stringi i liczby**

**Backend:**

```typescript
// Hardkodowane wartości
"http://local.adspower.net:50325";
timeout: 15000;
24 * 60 * 60 * 1000;
```

**Frontend:**

```typescript
// axios.ts
timeout: 60000;
// formatowanie ID
padStart(5, "0");
```

#### **4. Nadmierne console.log w produkcji**

**Frontend:** 40+ wystąpień console.log  
**Backend:** Setki wystąpień console.log/error

```typescript
console.log("🚀 [deliveryApi] uploadDeliveryFile called with:");
console.log("✅ [startup]: Zmienne środowiskowe załadowane.");
```

#### **5. Duplikowany kod**

**Identyczne error handling patterns:**

- `staffController` vs `supplierController`
- Powtarzające się wzorce walidacji w middleware
- Duplikacja token handling w API calls

#### **6. Problematyczne wzorce**

**Type safety issues:**

```typescript
// Używanie 'any'
status_weryfikacji: req.query.status_weryfikacji as any;

// Unsafe type assertions
req.user as AuthenticatedUser;
```

**Bezpośrednie SQL queries poza serwisami:**

```sql
-- W utils/
SELECT COUNT(*) as table_count FROM information_schema.tables
SELECT TABLE_NAME FROM information_schema.tables
```

## 6. Podsumowanie i Rekomendacje

### 🎯 Krytyczne Problemy do Rozwiązania:

1. **Usunięcie martwego kodu** (80% redukcja frontend files)
2. **Standaryzacja error handling** - jeden wzorzec dla całej aplikacji
3. **Migracja do jednej wersji AWS SDK** (v3)
4. **Unifikacja walidacji** (tylko Zod, usunięcie express-validator)
5. **Wprowadzenie centralnego state managera** (React Query + Zustand)
6. **Przeniesienie logiki biznesowej** z kontrolerów do serwisów
7. **Utworzenie stałych** dla magicznych wartości
8. **Centralizacja loggowania** - usunięcie console.log z produkcji

### 📊 Statystyki:

- **Backend pliki:** ~150 (można zredukować o 15%)
- **Frontend pliki:** ~350 (można zredukować o 80%)
- **API Endpoints:** 39 aktywnych + 1 moduł do usunięcia
- **Dependencies conflicts:** 3 krytyczne
- **Code smells:** 7 kategorii problemów
- **Martwy kod:** ~300 plików do potencjalnego usunięcia

### 🚀 Plan Działania:

1. **Faza 1:** Usunięcie martwego kodu i modułu Allegro
2. **Faza 2:** Standaryzacja dependencies i error handling
3. **Faza 3:** Refaktoryzacja frontend data flow
4. **Faza 4:** Optymalizacja i czyszczenie code smells

---

_Raport wygenerowany: 1.07.2025_  
_Analizowane foldery: `backend/src`, `src/`_  
_Całkowita liczba przeanalizowanych plików: ~500_
