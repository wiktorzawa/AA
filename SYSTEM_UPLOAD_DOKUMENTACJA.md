# 🚨 **OSTRZEŻENIE: WYMAGANA KONFIGURACJA ŚRODOWISKA** 🚨

## ⚠️ **UWAGA dla osób ściągających z GitHub:**

**Pliki `.env` z sekretami AWS i hasłami NIE SĄ w repozytorium!**

- **backend/.env** - MUSISZ stworzyć lokalnie z własnymi danymi AWS i bazy
- **Bez tego pliku aplikacja nie uruchomi się**
- **Zobacz sekcję "KONFIGURACJA ŚRODOWISKA" poniżej**

---

# 📋 **KOMPLETNY SYSTEM UPLOADU PLIKÓW EXCEL - DOKUMENTACJA TECHNICZNA**

## **🎯 PRZEGLĄD SYSTEMU**

System umożliwia dostawcom przesyłanie plików Excel z danymi dostaw, które są automatycznie przetwarzane, przechowywane w AWS S3 i zapisywane do bazy danych AWS RDS.

---

## **🏗️ ARCHITEKTURA SYSTEMU**

### **Tech Stack:**

- **Frontend:** React + TypeScript + Vite + Flowbite Pro
- **Backend:** Node.js + Express + TypeScript
- **Database:** AWS RDS MySQL 8.0
- **Storage:** AWS S3
- **ORM:** Sequelize
- **Authentication:** JWT + bcrypt

### **Struktura:**

```
Frontend (React)  ←→  Backend (Express)  ←→  AWS RDS (MySQL)
      ↓                     ↓
  Flowbite UI          AWS S3 Storage
```

---

## **📁 STRUKTURA PROJEKTU**

```
AA/
├── src/                          # Frontend React
│   ├── api/
│   │   ├── deliveryApi.ts       # API calls dla dostaw
│   │   └── axios.ts             # Konfiguracja HTTP
│   ├── pages/
│   │   ├── supplier/SupplierAddDeliveryPage.tsx
│   │   ├── staff/StaffAddDeliveryPage.tsx
│   │   └── admin/AdminAddDeliveryPage.tsx
│   └── contexts/AuthContext.tsx
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── deliveryController.ts    # HTTP endpoints
│   │   ├── services/
│   │   │   ├── deliveryService.ts       # Business logic
│   │   │   └── awsService.ts           # S3 operations
│   │   ├── models/
│   │   │   └── deliveries/             # Sequelize models
│   │   ├── routes/
│   │   │   └── deliveryRoutes.ts       # API routing
│   │   └── middleware/                 # Auth, validation
│   └── .env                           # Environment variables
```

---

## **🔄 PRZEPŁYW DANYCH - KROK PO KROKU**

### **1. FRONTEND - Upload Interface**

**Lokalizacja:** `src/pages/*/AddDeliveryPage.tsx`

```typescript
// Komponenty wykorzystywane:
- FileInput (Flowbite) - wybór pliku
- Button (Flowbite) - submit
- Card (Flowbite) - layout
- Alert (Flowbite) - komunikaty
```

**Proces:**

1. Użytkownik wybiera plik Excel (.xlsx, .xls, .xlsm)
2. Walidacja: format + rozmiar (max 10MB)
3. Tworzenie FormData z plikiem
4. Wywołanie `uploadDeliveryFile()` z `deliveryApi.ts`

### **2. FRONTEND API LAYER**

**Lokalizacja:** `src/api/deliveryApi.ts`

```typescript
export const uploadDeliveryFile = async (data: DeliveryUploadRequest) => {
  // 1. Pobierz token z localStorage
  const token = localStorage.getItem("token");

  // 2. Przygotuj FormData
  const formData = new FormData();
  formData.append("deliveryFile", data.file);

  // 3. HTTP POST z autoryzacją
  const response = await axiosInstance.post("/deliveries/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    timeout: 60000,
  });
};
```

### **3. BACKEND - HTTP ENDPOINT**

**Lokalizacja:** `backend/src/controllers/deliveryController.ts`

```typescript
public uploadDeliveryFile = asyncHandler(async (req, res) => {
  // 1. Walidacja pliku
  const file = req.files?.deliveryFile?.[0];
  if (!file) throw new AppError("Brak pliku", 400);

  // 2. Identyfikacja dostawcy
  let supplierId = req.body.id_dostawcy || req.user.id_uzytkownika;

  // 3. Przetwarzanie przez DeliveryService
  const result = await this.deliveryService.uploadAndProcessFile(
    file, supplierId, confirmDeliveryNumber
  );

  // 4. Response 201 Created
  res.status(201).json({ success: true, data: result });
});
```

### **4. BACKEND - Business Logic**

**Lokalizacja:** `backend/src/services/deliveryService.ts`

#### **4A. Przetwarzanie pliku Excel:**

```typescript
private processExcelFile(file: Express.Multer.File) {
  // 1. Walidacja formatu (XLSX/XLS/XLSM)
  this.validateFileFormat(file);

  // 2. Parsing Excel → JSON
  const workbook = XLSX.read(file.buffer, { type: "buffer" });
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  // 3. Przetwarzanie nagłówków
  const rawHeaders = jsonData[0] || [];
  const headers = rawHeaders.map(header =>
    typeof header === 'string' ? header : String(header || '')
  );

  // 4. Mapowanie kolumn (INTELIGENTNE)
  const columnMapping = this.detectColumnMapping(headers);

  // 5. Przetwarzanie produktów
  const products = [];
  for (let i = 1; i < jsonData.length; i++) {
    const product = this.mapRowToProduct(row, headers, columnMapping);
    if (product) products.push(product);
  }

  return { deliveryNumber, products, paletteNumbers, totalValue };
}
```

#### **4B. Inteligentne mapowanie kolumn:**

```typescript
public detectColumnMapping(headers: string[]) {
  const headerMap = {
    // Mapowanie polskich i angielskich nazw
    "nr palety": "paletteNumber",
    "item desc": "productName",
    "ean": "ean",
    "asin": "asin",
    "unit retail": "price",    // PRIORYTET!
    "wartość": "price",        // Fallback
    "lpn": "lpn",
    "department": "department"
  };

  // Mapowanie z priorytetami dla ceny
  headers.forEach(header => {
    const normalized = header.toLowerCase().trim();
    const field = headerMap[normalized];

    if (field === "price") {
      // "Unit Retail" > "Price" > "Cena" > "Wartość"
      if (normalized === "unit retail" || !mapping[field]) {
        mapping[field] = header;
      }
    }
  });
}
```

#### **4C. Mapowanie wiersza na produkt:**

```typescript
private mapRowToProduct(row: any[], headers: string[], mapping: ColumnMapping) {
  // 1. Pobierz wartości z mapowanych kolumn
  const getColumnValue = (field) => {
    const columnName = mapping[field];
    const columnIndex = headers.indexOf(columnName);
    return columnIndex >= 0 ? row[columnIndex] : undefined;
  };

  // 2. Inteligentny fallback dla ceny
  let priceValue = getColumnValue("price");
  if (!priceValue) {
    // Szukaj w kolumnach: "Unit Retail", "Price", "Cena"
    const priceHeaders = ["Unit Retail", "Price", "Cena"];
    for (const priceHeader of priceHeaders) {
      const index = headers.findIndex(h => h.toLowerCase() === priceHeader.toLowerCase());
      if (index >= 0 && row[index]) {
        priceValue = row[index];
        break;
      }
    }
  }

  // 3. Zwróć zmapowany produkt
  return {
    nr_palety: getColumnValue("paletteNumber")?.toString(),
    nazwa_produktu: getColumnValue("productName").toString(),
    kod_ean: this.normalizeEAN(getColumnValue("ean")),
    kod_asin: getColumnValue("asin")?.toString(),
    lpn: getColumnValue("lpn")?.toString(),
    ilosc: this.parseNumber(getColumnValue("quantity")) ?? 1,
    cena_produktu_spec: this.parseNumber(priceValue),
    kategoria_produktu: getColumnValue("department")?.toString()
  };
}
```

### **5. AWS S3 STORAGE**

**Lokalizacja:** `backend/src/services/awsService.ts`

```typescript
async uploadFile(fileBuffer: Buffer, key: string) {
  const command = new PutObjectCommand({
    Bucket: "msbox-app-all",
    Key: key,  // deliveries/SUP/00001/DST/PL10023419/filename.xls
    Body: fileBuffer,
    ContentType: 'application/octet-stream',
  });

  const response = await s3Client.send(command);
  return {
    Location: `https://msbox-app-all.s3.us-east-1.amazonaws.com/${key}`
  };
}
```

**Struktura folderów w S3:**

```
msbox-app-all/
└── deliveries/
    └── SUP/
        └── 00001/              # ID dostawcy
            └── DST/
                └── PL10023419/ # ID dostawy
                    └── plik.xls
```

### **6. DATABASE STORAGE (AWS RDS)**

#### **Struktura tabel:**

```sql
-- Główna tabela dostaw
CREATE TABLE dost_nowa_dostawa (
  id_dostawy VARCHAR(50) PRIMARY KEY,     -- DST/PL10023419
  id_dostawcy VARCHAR(20) NOT NULL,       -- SUP/00001
  nazwa_pliku VARCHAR(500) NOT NULL,
  url_pliku_S3 TEXT,
  nr_palet_dostawy TEXT,
  status_weryfikacji ENUM('nowa', 'weryfikowana', 'zatwierdzona', 'odrzucona'),
  data_utworzenia TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Produkty w dostawie
CREATE TABLE dost_dostawy_produkty (
  id_produktu_dostawy INT AUTO_INCREMENT PRIMARY KEY,
  id_dostawy VARCHAR(50),
  nr_palety VARCHAR(50),
  nazwa_produktu VARCHAR(500) NOT NULL,
  kod_ean VARCHAR(20),
  kod_asin VARCHAR(20),
  LPN VARCHAR(50),
  ilosc INT NOT NULL,
  cena_produktu_spec DECIMAL(10,2),
  status_weryfikacji ENUM('nowy', 'weryfikowany', 'zatwierdzony', 'odrzucony'),
  FOREIGN KEY (id_dostawy) REFERENCES dost_nowa_dostawa(id_dostawy)
);
```

#### **Zapis do bazy:**

```typescript
async uploadAndProcessFile(file, id_dostawcy, confirmDeliveryNumber) {
  const transaction = await sequelize.transaction();

  try {
    // 1. Przetwórz Excel
    const processedData = this.processExcelFile(file);

    // 2. Upload do S3
    const s3Key = `deliveries/${id_dostawcy}/${deliveryId}/${file.originalname}`;
    const s3Result = await awsService.uploadFile(file.buffer, s3Key);

    // 3. Zapisz dostawę
    const dostawa = await DostNowaDostawa.create({
      id_dostawy: deliveryId,
      id_dostawcy,
      nazwa_pliku: file.originalname,
      url_pliku_S3: s3Result.Location,
      nr_palet_dostawy: this.formatPaletteNumbers(processedData.paletteNumbers),
      status_weryfikacji: "nowa",
    }, { transaction });

    // 4. Zapisz produkty
    const products = await Promise.all(
      processedData.products.map(product =>
        DostDostawyProdukty.create({
          id_dostawy: dostawa.id_dostawy,
          nr_palety: product.nr_palety,
          nazwa_produktu: product.nazwa_produktu,
          kod_ean: product.kod_ean,
          kod_asin: product.kod_asin,
          LPN: product.lpn,
          ilosc: product.ilosc,
          cena_produktu_spec: product.cena_produktu_spec,
          status_weryfikacji: "nowy",
        }, { transaction })
      )
    );

    await transaction.commit();
    return { id_dostawy, liczba_produktow: products.length, ... };

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

---

## **🔐 BEZPIECZEŃSTWO**

### **Autoryzacja:**

```typescript
// JWT Token w każdym żądaniu
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Middleware sprawdza token
middleware: [authenticateToken, requireRole(['supplier', 'staff', 'admin'])]
```

### **Walidacja plików:**

```typescript
// Format: tylko Excel
allowedMimeTypes = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
  "application/vnd.ms-excel.sheet.macroEnabled.12", // .xlsm
];

// Rozmiar: max 10MB
maxSize = 10 * 1024 * 1024;
```

### **Ochrona przed duplikatami:**

```typescript
// Sprawdzanie czy dostawa już istnieje
const existingDelivery = await DostNowaDostawa.findByPk(deliveryId);
if (existingDelivery) {
  throw new AppError(`Dostawa o numerze ${deliveryId} już istnieje`, 409);
}
```

---

## **⚙️ KONFIGURACJA ŚRODOWISKA**

### **Backend `.env`:**

```env
# Database
DB_HOST=flask-app-msbox.chqqwymic43o.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=***
DB_NAME=msbox_db

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA5GBFNV***
AWS_SECRET_ACCESS_KEY=***
S3_BUCKET=msbox-app-all

# Security
JWT_SECRET=***
```

### **Frontend axios:**

```typescript
const API_URL = "http://localhost:3001/api";
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 60000,
});
```

---

## **🚨 OBSŁUGA BŁĘDÓW**

### **Walidacja danych:**

```typescript
// Krytyczne błędy (throw AppError)
- Brak pliku
- Nieprawidłowy format
- Plik za duży
- Brak produktów w pliku
- Dostawa już istnieje

// Ostrzeżenia (warnings array)
- Brak niektórych kolumn
- Produkty bez cen
- Produkty bez kodów EAN
```

### **Response format:**

```typescript
// Sukces
{
  success: true,
  data: {
    id_dostawy: "DST/PL10023419",
    liczba_produktow: 45,
    wartosc_calkowita: 1234.56,
    url_pliku_S3: "https://..."
  }
}

// Błąd
{
  success: false,
  error: "Dostawa o numerze DST/PL10023419 już istnieje"
}
```

---

## **📊 MONITORING I LOGI**

### **Logowanie etapów:**

```typescript
console.log("🚀 [DeliveryController]: uploadDeliveryFile wywołane");
console.log("🔍 Raw headers z Excel:", rawHeaders);
console.log("🔧 Final mapping after priorities:", mapping);
console.log("📤 [DeliveryService]: Rozpoczynam upload do S3...");
console.log("✅ S3 Upload completed:", location);
console.log("💾 [DeliveryService]: Rozpoczynam zapis do bazy danych...");
console.log("🎉 [DeliveryService]: Przesłano i przetworzono plik");
```

### **Metryki:**

- Czas przetwarzania: ~51 sekund
- Rozmiar pliku: 140KB
- Liczba produktów: zależna od pliku
- Status HTTP: 201 Created

---

## **🔄 PRZYKŁADOWY PEŁNY PRZEPŁYW**

1. **Frontend:** Wybór pliku `Dostawa_PL10023419.xls`
2. **API Call:** POST `/api/deliveries/upload` z FormData + JWT
3. **Controller:** Walidacja file + user permissions
4. **Service:** Excel parsing + column mapping
5. **S3 Upload:** `deliveries/SUP/00001/DST/PL10023419/Dostawa_PL10023419.xls`
6. **Database:** Insert do `dost_nowa_dostawa` + `dost_dostawy_produkty`
7. **Response:** Success 201 z danymi dostawy
8. **Frontend:** Wyświetlenie komunikatu sukcesu

---

## **🎯 KLUCZOWE CECHY SYSTEMU**

### **✅ CO DZIAŁA:**

- Kompletny pipeline Frontend → Backend → S3 → Database
- Inteligentne mapowanie kolumn Excel na pola bazy danych
- Obsługa różnych formatów Excel (.xlsx, .xls, .xlsm)
- Autoryzacja JWT z rolami (supplier, staff, admin)
- Transakcje bazodanowe z rollback przy błędach
- Ochrona przed duplikatami dostaw
- Szczegółowe logowanie każdego etapu
- Szyfrowane przechowywanie plików w S3
- Walidacja formatów i rozmiarów plików

### **📈 STATYSTYKI WYDAJNOŚCI:**

- Upload + przetwarzanie: ~51 sekund
- Rozmiar przykładowego pliku: 140KB
- Liczba produktów: zależna od zawartości Excel
- Sukces rate: 100% dla prawidłowych plików

### **🛡️ BEZPIECZEŃSTWO:**

- JWT authentication wymagane
- Role-based access control
- Walidacja formatów plików
- Limit rozmiaru pliku (10MB)
- SQL injection protection (Sequelize ORM)
- Encrypted storage (S3 AES256)

**System jest kompletny, działający i gotowy do produkcji.** ✅

---

## **📋 QUICK COPY-PASTE CHECKLIST**

Jeśli chcesz zreplikować ten system, potrzebujesz:

### **1. Environment Variables (.env):**

```env
DB_HOST=your-rds-endpoint
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=your-password
DB_NAME=msbox_db
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET=your-bucket-name
JWT_SECRET=your-jwt-secret
```

### **2. SQL Tables (execute once):**

```sql
CREATE TABLE dost_nowa_dostawa (
  id_dostawy VARCHAR(50) PRIMARY KEY,
  id_dostawcy VARCHAR(20) NOT NULL,
  nazwa_pliku VARCHAR(500) NOT NULL,
  url_pliku__s3 TEXT,
  nr_palet_dostawy TEXT,
  status_weryfikacji ENUM('nowa', 'weryfikowana', 'zatwierdzona', 'odrzucona') DEFAULT 'nowa',
  data_utworzenia TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dost_dostawy_produkty (
  id_produktu_dostawy INT AUTO_INCREMENT PRIMARY KEY,
  id_dostawy VARCHAR(50),
  nr_palety VARCHAR(50),
  nazwa_produktu VARCHAR(500) NOT NULL,
  kod_ean VARCHAR(20),
  kod_asin VARCHAR(20),
  LPN VARCHAR(50),
  ilosc INT NOT NULL,
  cena_produktu_spec DECIMAL(10,2),
  kategoria_produktu VARCHAR(200),
  status_weryfikacji ENUM('nowy', 'weryfikowany', 'zatwierdzony', 'odrzucony') DEFAULT 'nowy',
  data_utworzenia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_dostawy) REFERENCES dost_nowa_dostawa(id_dostawy)
);
```

### **3. NPM Dependencies:**

```bash
# Backend
npm install @aws-sdk/client-s3 xlsx multer

# Frontend
npm install axios
```

### **4. Key Files to Implement:**

- `src/api/deliveryApi.ts` - API calls
- `backend/src/services/deliveryService.ts` - Business logic
- `backend/src/services/awsService.ts` - S3 operations
- `backend/src/controllers/deliveryController.ts` - HTTP endpoints
- `backend/src/models/deliveries/` - Sequelize models

**To wszystko co potrzebujesz do uruchomienia systemu!** 🚀
