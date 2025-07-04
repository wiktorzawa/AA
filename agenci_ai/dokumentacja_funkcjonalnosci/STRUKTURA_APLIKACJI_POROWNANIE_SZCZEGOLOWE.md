# Raport Porównawczy Struktury Aplikacji (Szczegółowy)

**Data:** 01.07.2025

Poniższy dokument przedstawia szczegółowe, rozbudowane porównanie struktury plików projektu przed i po przeprowadzonej operacji restrukturyzacji.

- Pliki i foldery oznaczone `(GIT_IGNORED)` są ignorowane przez system kontroli wersji.
- `(MARTWY KOD)`, `(DUPLIKAT)`, `(NIEUŻYWANE)` oznaczają problemy zidentyfikowane w stanie początkowym.

---

## Struktura PRZED Restrukturyzacją

<details>
<summary>Rozwiń, aby zobaczyć szczegółowy stan początkowy</summary>

```
.
├── .gitignore
├── .vscode/
│   ├── extensions.json
│   └── settings.json
├── backend/
│   ├── .gitignore
│   ├── .sequelizerc
│   ├── coverage/ (GIT_IGNORED)
│   ├── dist/ (GIT_IGNORED)
│   ├── jest.config.js
│   ├── node_modules/ (GIT_IGNORED)
│   ├── package.json
│   ├── src/
│   │   ├── config/
│   │   │   ├── aws.ts
│   │   │   ├── config.ts
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   ├── auth/
│   │   │   │   ├── authController.ts
│   │   │   │   ├── staffController.ts
│   │   │   │   └── supplierController.ts
│   │   │   ├── adsPowerController.ts
│   │   │   ├── allegroController.ts (MARTWY KOD)
│   │   │   ├── brightDataController.ts
│   │   │   └── deliveryController.ts
│   │   ├── middleware/
│   │   │   ├── auth/
│   │   │   ├── deliveries/
│   │   │   ├── error/
│   │   │   ├── logging/
│   │   │   ├── session/
│   │   │   └── validation/
│   │   ├── models/
│   │   │   ├── auth/
│   │   │   └── deliveries/
│   │   ├── routes/
│   │   │   ├── auth/
│   │   │   ├── allegroRoutes.ts (MARTWY KOD)
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── auth/
│   │   │   ├── allegroService.ts (MARTWY KOD)
│   │   │   └── ...
│   │   ├── types/
│   │   ├── utils/
│   │   └── server.ts
│   └── tests/
├─�� public/
│   ├── figma.svg
│   ├── flowbite-react.svg
│   ├── flowbite.svg
│   ├── pattern-dark.svg
│   └── pattern-light.svg
├── src/
│   ├── api/
│   │   ├── adsPowerApi.ts
│   │   ├── authApi.ts
│   │   ├── axios.ts
│   │   ├── brightDataApi.ts
│   │   ├── deliveryApi.ts
│   │   ├── login_auth_data.api.ts (DUPLIKAT)
│   │   ├── login_table_staff.api.ts (DUPLIKAT)
│   │   ├── login_table_suppliers.api.ts (DUPLIKAT)
│   │   ├── loginHistoryApi.ts
│   │   ├── staffApi.ts
│   │   └── supplierApi.ts
│   ├── components/
│   │   ├── authentication/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── blocks/ (MARTWY KOD)
│   │   │   ├── application-ui/ (291 PLIKÓW)
│   │   │   └── ...
│   │   ├── navbar/
│   │   └── sidebar/
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── helpers/ (NIEUŻYWANE)
│   │   ├── is-browser.ts
│   │   └── is-small-screen.ts
│   ├── layouts/
│   │   ├── AdminLayout.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── StaffLayout.tsx
│   │   └── SupplierLayout.tsx
│   ├── pages/
│   │   ├── admin/
│   │   ├── authentication/
│   │   ├── staff/
│   │   └── supplier/
│   ├── theme/
│   │   └── custom-theme.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
└── ... (inne pliki konfiguracyjne)
```

</details>

---

## Struktura PO Restrukturyzacji

```
.
├── .DS_Store (GIT_IGNORED)
├── .env (GIT_IGNORED)
├── .gitignore
├── .vscode/
│   ├── extensions.json
│   └── settings.json
├── INWENTARYZACJA_KODU_RAPORT.md
├── LICENSE
├── PLAN_RESTRUKTURYZACJI.MD
├── RAPORT_KONCOWY_RESTRUKTURYZACJI.md
├── README.md
├── STRATEG_GEMINI.MD
├── STRUKTURA_APLIKACJI_POROWNANIE.md
├── STRUKTURA_APLIKACJI_POROWNANIE_SZCZEGOLOWE.md (TEN PLIK)
├── SYSTEM_UPLOAD_DOKUMENTACJA.md
├── WYKONAWCA_AMP.md
├── WYKONAWCA_PROMPT.md
├── aktualna.sql
├── aktualna_clean.sql
├── aktualna_fixed.sql
├── backup_2025-06-26_130057.sql
├── backup_2025-06-27_094535_complete.sql
├── backup_kompletna_migracja.sql
��── backend/
│   ├── .DS_Store (GIT_IGNORED)
│   ├── .env.test (GIT_IGNORED)
│   ├── .gitignore
│   ├── .sequelizerc
│   ├── cleanup_aws_tables.sql
│   ├── cleanup_tables.sql
│   ├── create_delivery_tables_aws.sql
│   ├── jest.config.js
│   ├── package-lock.json
│   ├── package.json
│   ├── server.log (GIT_IGNORED)
│   ├── src/
│   │   ├── .DS_Store (GIT_IGNORED)
│   │   ├── config/
│   │   │   ├── aws.ts
│   │   │   ├── config.ts
│   │   │   └── database.ts
│   │   ├── constants.ts
│   │   ├── controllers/
│   │   │   ├── adsPowerController.ts
│   │   │   ├── auth/
│   │   │   │   ├── authController.ts
│   │   │   │   ├── staffController.ts
│   │   │   │   └── supplierController.ts
│   │   │   ├── brightDataController.ts
│   │   │   └── deliveryController.ts
│   │   ├── database/
│   │   │   ├── .DS_Store (GIT_IGNORED)
│   │   │   └── csv_supplier_input/
│   │   ├── middleware/
│   │   │   ├── auth/
│   │   │   │   ├── authenticateToken.middleware.ts
│   │   │   │   ├── requireAdmin.middleware.ts
│   │   │   │   └── requireRole.middleware.ts
│   │   │   ├── deliveries/
│   │   │   │   ├── deliveryPermissions.middleware.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── validateDeliveryData.middleware.ts
│   │   │   ├── error/
│   │   │   │   └── errorHandler.middleware.ts
│   │   │   ├── index.ts
│   │   │   ├── logging/
│   │   │   │   └── requestLogger.middleware.ts
│   │   │   ├── session/
│   │   │   │   └── sessionCleaner.middleware.ts
│   │   │   └── validation/
│   │   │       ├── validateLoginData.middleware.ts
│   │   │       ├── validateStaffData.middleware.ts
│   │   │       ├── validateSupplierData.middleware.ts
│   │   │       └── zodValidation.ts
│   │   ├── models/
│   │   │   ├── .DS_Store (GIT_IGNORED)
│   │   │   ├── auth/
│   │   │   │   ├── AuthDaneAutoryzacji.ts
│   │   │   │   ├── AuthDostawcy.ts
│   │   │   │   ├── AuthHistoriaLogowan.ts
│   │   │   │   ├── AuthPracownicy.ts
│   │   │   │   └── index.ts
│   │   │   ├── deliveries/
│   │   │   │   ├── DostDostawyProdukty.ts
│   │   │   │   ├── DostFakturyDostawcow.ts
│   │   │   │   ├── DostFinanseDostaw.ts
│   │   │   │   ├── DostNowaDostawa.ts
│   │   │   │   └── index.ts
│   │   │   ├── AmazonProduct.ts
│   │   │   └── index.ts
│   │   ├── routes/
│   │   │   ├── adsPowerRoutes.ts
│   │   │   ├── auth/
│   │   │   │   ├── authRoutes.ts
│   │   │   │   ├── staffRoutes.ts
│   │   │   │   └── supplierRoutes.ts
│   │   │   ├── brightDataRoutes.ts
│   │   │   ├── deliveryRoutes.ts
│   │   │   └── index.ts
│   │   ├── server.ts
│   │   ├── services/
│   │   │   ├── adsPowerService.ts
│   │   │   ├── auth/
│   │   │   │   └── authService.ts
│   │   │   ├── awsService.ts
│   │   │   ├── brightDataService.ts
│   │   │   ├── deliveryService.ts
│   │   │   ├── index.ts
│   │   │   └── passwordService.ts
│   │   ├���─ types/
│   │   │   ├── adsPower.ts
│   │   │   ├── auth.types.ts
│   │   │   ├── delivery.types.ts
│   │   │   ├── express.d.ts
│   │   │   └── index.ts
│   │   └── utils/
│   │       ├── AppError.ts
│   │       ├── apply-database-improvements.ts
│   │       ├── countryValidation.ts
│   │       ├── database-ddl-extractor.ts
│   │       └── logger.ts
│   └── tests/
│       ├── __mocks__/
│       │   └── aws-sdk.ts
│       ├── integration/
│       ├── setup.js
│       ├── setup.ts
│       └── unit/
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── prettier.config.js
├── public/
│   ├── figma.svg
│   ├── flowbite-react.svg
│   ├── flowbite.svg
│   ├── pattern-dark.svg
│   └── pattern-light.svg
├── src/
│   ├── .DS_Store (GIT_IGNORED)
│   ├── api/
│   │   ├── adsPowerApi.ts
│   │   ├── authApi.ts
│   │   ├── axios.ts
│   │   ├── brightDataApi.ts
│   │   ├── deliveryApi.ts
│   │   ├── loginHistoryApi.ts
│   │   ├── productsApi.ts
│   │   ├── staffApi.ts
│   │   └── supplierApi.ts
│   ├── App.tsx
│   ├── components/
│   │   ├── authentication/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── block-breadcrumb.tsx
│   │   ├── block-section.tsx
│   │   ├── navbar/
│   │   │   └── DashboardNavbar.tsx
│   │   └── sidebar/
│   │       ├── AdminSidebar.tsx
│   │       ├── AppSidebar.tsx
│   │       ├── StaffSidebar.tsx
│   │       └── SupplierSidebar.tsx
│   ├── constants.ts
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── data/
│   │   └── blocks-categories.json
│   ├── index.css
│   ├── layouts/
│   │   ├── AdminLayout.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── StaffLayout.tsx
│   │   └── SupplierLayout.tsx
│   ├── main.tsx
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminAddDeliveryPage.tsx
│   │   │   ├── AdminDashboardPage.tsx
│   │   │   ├── AdminLandingPage.tsx
│   │   │   ├── AdminProductsPage.tsx
│   │   │   └── AdminTablesPage.tsx
│   │   ├── authentication/
│   │   │   ├── forgot-password.tsx
│   │   │   ├── profile-lock.tsx
│   │   │   ├── reset-password.tsx
│   │   │   ├── sign-in-background.tsx
│   │   │   ├── sign-in.tsx
│   │   │   └── sign-up.tsx
│   │   ├── staff/
│   │   │   ├── StaffAddDeliveryPage.tsx
│   │   │   ├── StaffDashboardPage.tsx
│   │   │   └── StaffTasksPage.tsx
│   │   └── supplier/
│   │       ├── SupplierAddDeliveryPage.tsx
│   │       ├── SupplierDashboardPage.tsx
│   │       └── SupplierDeliveriesPage.tsx
│   ├── stores/
│   │   └── uiStore.ts
│   ├── theme/
│   │   └── custom-theme.ts
│   ├── utils/
│   │   └── logger.ts
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.node.json
```
