# Plan Migracji na Strapi

## 📊 Analiza obecnej architektury

### Backend

- **Framework**: Node.js + Express + TypeScript
- **ORM**: Sequelize
- **Autoryzacja**: JWT + role-based (admin, staff, supplier)
- **Struktura**: MVC z warstwą serwisów

### Frontend

- **Framework**: React + TypeScript + Vite
- **State**: TanStack Query + Zustand
- **API**: Axios z interceptorami

### Baza danych

- **System**: PostgreSQL
- **Tabele**: 8 głównych (auth*\*, dost*\*)
- **Relacje**: Złożone powiązania między modelami

## 🎯 Cel migracji

Zastąpienie obecnego backendu przez Strapi CMS, zachowując:

- Istniejącą bazę danych
- Frontend React
- System autoryzacji
- Logikę biznesową

## 📋 Plan migracji - 5 faz

### Faza 1: Przygotowanie środowiska (2-3 dni)

1. **Instalacja Strapi**

```bash
npx create-strapi-app@latest strapi-backend --typescript
cd strapi-backend
npm install
```

2. **Konfiguracja bazy danych**

```javascript
// config/database.js
module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("DATABASE_HOST", "localhost"),
      port: env.int("DATABASE_PORT", 5432),
      database: env("DATABASE_NAME", "your_db"),
      user: env("DATABASE_USERNAME", "postgres"),
      password: env("DATABASE_PASSWORD", "password"),
      ssl: env.bool("DATABASE_SSL", false),
    },
  },
});
```

3. **Struktura folderów**

```
strapi-backend/
├── src/
│   ├── api/
│   │   ├── delivery/
│   │   ├── product/
│   │   ├── supplier/
│   │   └── staff/
│   ├── extensions/
│   │   └── users-permissions/
│   └── middlewares/
```

### Faza 2: Migracja modeli (3-4 dni)

1. **Mapowanie modeli Sequelize → Strapi Content Types**

**Przykład: DostNowaDostawa**

```javascript
// src/api/delivery/content-types/delivery/schema.json
{
  "kind": "collectionType",
  "collectionName": "dost_nowa_dostawa",
  "info": {
    "singularName": "delivery",
    "pluralName": "deliveries",
    "displayName": "Dostawa"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "id_dostawy": {
      "type": "string",
      "required": true,
      "unique": true,
      "maxLength": 50
    },
    "id_dostawcy": {
      "type": "string",
      "required": true,
      "maxLength": 20
    },
    "id_pliku": {
      "type": "string",
      "required": true,
      "unique": true,
      "maxLength": 255
    },
    "nazwa_pliku": {
      "type": "string",
      "required": true,
      "maxLength": 255
    },
    "url_pliku_S3": {
      "type": "text",
      "required": true
    },
    "nr_palet_dostawy": {
      "type": "text"
    },
    "status_weryfikacji": {
      "type": "enumeration",
      "enum": ["nowa", "trwa weryfikacja", "zweryfikowano", "raport", "zakończono"],
      "default": "nowa"
    },
    "products": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::product.product",
      "mappedBy": "delivery"
    }
  }
}
```

2. **Zachowanie istniejących nazw tabel**

```javascript
// src/api/delivery/content-types/delivery/lifecycles.js
module.exports = {
  beforeCreate(event) {
    // Custom logic przed utworzeniem
  },
  afterCreate(event) {
    // Custom logic po utworzeniu
  },
};
```

### Faza 3: Migracja autoryzacji (2-3 dni)

1. **Rozszerzenie Users & Permissions Plugin**

```typescript
// src/extensions/users-permissions/strapi-server.js
module.exports = (plugin) => {
  // Dodanie customowych pól do użytkownika
  plugin.contentTypes.user.schema.attributes = {
    ...plugin.contentTypes.user.schema.attributes,
    id_uzytkownika: {
      type: "string",
      unique: true,
      required: true,
    },
    rola_uzytkownika: {
      type: "enumeration",
      enum: ["admin", "staff", "supplier"],
      required: true,
    },
  };

  // Custom kontrolery
  plugin.controllers.auth.callback = async (ctx) => {
    // Własna logika logowania kompatybilna z obecnym frontendem
  };

  return plugin;
};
```

2. **Konfiguracja ról i uprawnień**

```javascript
// Bootstrap funkcja do konfiguracji ról
async function setPermissions() {
  const roles = {
    admin: ["find", "findOne", "create", "update", "delete"],
    staff: ["find", "findOne", "create", "update"],
    supplier: ["find", "findOne"], // tylko swoje dane
  };

  // Implementacja przypisywania uprawnień
}
```

### Faza 4: Migracja logiki biznesowej (3-4 dni)

1. **Custom Controllers**

```typescript
// src/api/delivery/controllers/delivery.js
module.exports = {
  async uploadDeliveryFile(ctx) {
    const { file } = ctx.request.files;
    const { supplierId } = ctx.state.user;

    // Walidacja pliku
    if (!validateExcelFile(file)) {
      return ctx.badRequest("Invalid file format");
    }

    // Przetwarzanie Excel
    const products = await parseExcelFile(file);

    // Zapis do bazy
    const delivery = await strapi.service("api::delivery.delivery").create({
      data: {
        id_dostawcy: supplierId,
        products: products,
      },
    });

    return { success: true, data: delivery };
  },
};
```

2. **Custom Services**

```typescript
// src/api/delivery/services/delivery.js
module.exports = {
  async processDeliveryFile(fileData) {
    // Logika przetwarzania plików Excel
    // Mapowanie kolumn
    // Walidacja danych
  },

  async calculateDeliveryFinances(deliveryId) {
    // Obliczenia finansowe
  },
};
```

3. **Middleware**

```javascript
// src/middlewares/delivery-permissions.js
module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (ctx.state.user.role === "supplier") {
      // Sprawdzenie czy dostawca ma dostęp do danych
    }
    await next();
  };
};
```

### Faza 5: Integracja z frontendem (2-3 dni)

1. **Adapter API dla kompatybilności**

```typescript
// src/api/adapter/controllers/adapter.js
module.exports = {
  // Mapowanie starych endpointów na nowe
  async legacyLogin(ctx) {
    const { adres_email, haslo } = ctx.request.body;

    // Wywołanie Strapi auth
    const result = await strapi.plugins[
      "users-permissions"
    ].services.auth.callback({
      identifier: adres_email,
      password: haslo,
    });

    // Zwrócenie w starym formacie
    return {
      success: true,
      token: result.jwt,
      userRole: result.user.rola_uzytkownika,
      userId: result.user.id_uzytkownika,
    };
  },
};
```

2. **Routing kompatybilny z obecnym API**

```javascript
// src/api/adapter/routes/adapter.js
module.exports = {
  routes: [
    {
      method: "POST",
      path: "/api/auth/login",
      handler: "adapter.legacyLogin",
    },
    {
      method: "GET",
      path: "/api/products",
      handler: "product.find",
      config: {
        middlewares: ["api::adapter.format-response"],
      },
    },
  ],
};
```

## 🔧 Narzędzia pomocnicze

### Migration Scripts

```javascript
// scripts/migrate-data.js
const { Sequelize } = require("sequelize");
const axios = require("axios");

async function migrateUsers() {
  const oldUsers = await sequelizeDB.query(
    "SELECT * FROM auth_dane_autoryzacji",
  );

  for (const user of oldUsers) {
    await axios.post("http://localhost:1337/api/users", {
      // mapowanie danych
    });
  }
}
```

### Validation Layer

```typescript
// src/utils/validators.js
const Joi = require("joi");

const deliverySchema = Joi.object({
  id_dostawcy: Joi.string().required(),
  products: Joi.array().items(
    Joi.object({
      nazwa_produktu: Joi.string().required(),
      ilosc: Joi.number().min(1).required(),
    }),
  ),
});
```

## 📊 Harmonogram

| Faza                | Czas          | Priorytet |
| ------------------- | ------------- | --------- |
| Faza 1: Środowisko  | 2-3 dni       | Krytyczny |
| Faza 2: Modele      | 3-4 dni       | Krytyczny |
| Faza 3: Autoryzacja | 2-3 dni       | Wysoki    |
| Faza 4: Logika      | 3-4 dni       | Wysoki    |
| Faza 5: Integracja  | 2-3 dni       | Średni    |
| **RAZEM**           | **12-17 dni** | -         |

## ⚠️ Ryzyka i mitygacja

1. **Niekompatybilność API**
   - Rozwiązanie: Warstwa adaptera
2. **Różnice w strukturze danych**
   - Rozwiązanie: Custom controllers i services
3. **System autoryzacji**
   - Rozwiązanie: Rozszerzenie Users & Permissions

4. **Wydajność**
   - Rozwiązanie: Indeksy, cache, optymalizacja zapytań

## ✅ Zalety po migracji

1. **Admin Panel** - gotowy interfejs do zarządzania
2. **API Documentation** - automatyczna z Swagger
3. **GraphQL** - opcjonalne API GraphQL
4. **Plugins** - email, upload, i18n
5. **Webhooks** - integracje z zewnętrznymi serwisami
6. **Łatwiejsze utrzymanie** - mniej kodu do zarządzania

## 🚨 Kroki krytyczne

1. **Backup bazy danych** przed każdą fazą
2. **Testy E2E** po każdej fazie
3. **Deployment staging** przed produkcją
4. **Rollback plan** dla każdej fazy

## 🔍 Szczegółowe przykłady implementacji

### 1. Migracja systemu uploadowania plików Excel

**Obecny kod (Express + Multer):**

```typescript
// backend/src/routes/deliveryRoutes.ts
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = file.originalname
      .toLowerCase()
      .slice(file.originalname.lastIndexOf("."));
    if ([".xlsx", ".xls", ".xlsm"].includes(ext)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});
```

**Nowy kod (Strapi):**

```javascript
// strapi-backend/src/api/delivery/controllers/delivery.js
const xlsx = require("xlsx");

module.exports = {
  async uploadDeliveryFile(ctx) {
    const { files } = ctx.request;

    if (!files || !files.deliveryFile) {
      return ctx.badRequest("No file uploaded");
    }

    const file = files.deliveryFile;

    // Walidacja typu pliku
    const allowedExtensions = [".xlsx", ".xls", ".xlsm"];
    const fileExt = path.extname(file.name).toLowerCase();

    if (!allowedExtensions.includes(fileExt)) {
      return ctx.badRequest("Invalid file type");
    }

    // Przetwarzanie Excel
    const workbook = xlsx.read(file.data, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // Mapowanie kolumn (zachowanie obecnej logiki)
    const mappedProducts = jsonData.map((row) => ({
      nazwa_produktu: row["Item Desc"] || row["Product Name"] || row["Nazwa"],
      kod_ean: row["EAN"] || row["ean"] || row["EAN_CODE"],
      kod_asin: row["ASIN"] || row["asin"] || row["ASIN_CODE"],
      ilosc: parseInt(row["Quantity"] || row["Qty"] || 1),
      cena_produktu_spec: parseFloat(row["Unit Retail"] || row["Price"] || 0),
      stan_produktu: row["Stan"] || row["Condition"] || "new",
      kategoria_produktu: row["DEPARTMENT"] || row["Category"],
    }));

    // Utworzenie dostawy
    const delivery = await strapi.service("api::delivery.delivery").create({
      data: {
        id_dostawcy: ctx.state.user.id_uzytkownika,
        id_pliku: `PLK/${Date.now()}/${ctx.state.user.id_uzytkownika}`,
        nazwa_pliku: file.name,
        status_weryfikacji: "nowa",
        products: {
          create: mappedProducts,
        },
      },
    });

    return { success: true, data: delivery };
  },
};
```

### 2. Zachowanie struktury odpowiedzi API

**Middleware formatowania odpowiedzi:**

```javascript
// strapi-backend/src/middlewares/format-response.js
module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    await next();

    // Formatowanie odpowiedzi zgodnie z obecnym API
    if (ctx.response.body && ctx.response.status === 200) {
      const isError = ctx.response.status >= 400;

      ctx.response.body = {
        success: !isError,
        data: ctx.response.body.data || ctx.response.body,
        error: isError ? ctx.response.body.error : undefined,
        pagination: ctx.response.body.meta?.pagination
          ? {
              page: ctx.response.body.meta.pagination.page,
              totalPages: ctx.response.body.meta.pagination.pageCount,
              totalItems: ctx.response.body.meta.pagination.total,
            }
          : undefined,
      };
    }
  };
};
```

### 3. Migracja złożonych zapytań

**Obecne zapytanie (Sequelize):**

```typescript
// backend/src/controllers/deliveryController.ts
const deliveries = await DostNowaDostawa.findAndCountAll({
  where: {
    ...(id_dostawcy && { id_dostawcy }),
    ...(status_weryfikacji && { status_weryfikacji }),
    ...(nazwa_pliku && {
      nazwa_pliku: { [Op.iLike]: `%${nazwa_pliku}%` },
    }),
  },
  include: [
    {
      model: DostDostawyProdukty,
      as: "products",
      required: false,
    },
  ],
  order: [[sortBy, sortOrder]],
  limit,
  offset,
});
```

**Nowe zapytanie (Strapi):**

```javascript
// strapi-backend/src/api/delivery/services/delivery.js
module.exports = ({ strapi }) => ({
  async findWithFilters(params) {
    const {
      id_dostawcy,
      status_weryfikacji,
      nazwa_pliku,
      page = 1,
      pageSize = 10,
      sortBy = "data_utworzenia",
      sortOrder = "DESC",
    } = params;

    const filters = {
      ...(id_dostawcy && { id_dostawcy: { $eq: id_dostawcy } }),
      ...(status_weryfikacji && {
        status_weryfikacji: { $eq: status_weryfikacji },
      }),
      ...(nazwa_pliku && { nazwa_pliku: { $containsi: nazwa_pliku } }),
    };

    const deliveries = await strapi.entityService.findMany(
      "api::delivery.delivery",
      {
        filters,
        populate: ["products"],
        sort: { [sortBy]: sortOrder.toLowerCase() },
        pagination: {
          page,
          pageSize,
        },
      },
    );

    return deliveries;
  },
});
```

### 4. Custom walidacja z Joi

```javascript
// strapi-backend/src/api/delivery/middlewares/validate-delivery.js
const Joi = require("joi");

module.exports = (config, { strapi }) => {
  const deliverySchema = Joi.object({
    id_dostawcy: Joi.string().max(20).required(),
    products: Joi.array()
      .items(
        Joi.object({
          nazwa_produktu: Joi.string().max(255).required(),
          kod_ean: Joi.string().max(13).optional(),
          kod_asin: Joi.string().max(20).optional(),
          ilosc: Joi.number().integer().min(1).required(),
          cena_produktu_spec: Joi.number().precision(2).optional(),
        }),
      )
      .min(1)
      .required(),
  });

  return async (ctx, next) => {
    try {
      await deliverySchema.validateAsync(ctx.request.body);
      await next();
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  };
};
```

### 5. Migracja procesu autoryzacji

```javascript
// strapi-backend/src/extensions/users-permissions/strapi-server.js
module.exports = (plugin) => {
  // Override domyślnego login
  plugin.controllers.auth.callback = async (ctx) => {
    const { adres_email, haslo } = ctx.request.body;

    try {
      // Znajdź użytkownika
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { email: adres_email },
          populate: ["role"],
        });

      if (!user) {
        return ctx.badRequest("Nieprawidłowy email lub hasło");
      }

      // Sprawdź hasło
      const validPassword = await strapi.plugins[
        "users-permissions"
      ].services.user.validatePassword(haslo, user.password);

      if (!validPassword) {
        return ctx.badRequest("Nieprawidłowy email lub hasło");
      }

      // Generuj JWT
      const token = strapi.plugins["users-permissions"].services.jwt.issue({
        id: user.id,
      });

      // Zapisz w historii logowań
      await strapi.entityService.create("api::auth-history.auth-history", {
        data: {
          id_logowania: user.id_logowania,
          status_logowania: "success",
          poczatek_sesji: new Date(),
        },
      });

      // Zwróć w formacie zgodnym z obecnym API
      return {
        success: true,
        token,
        refresh_token: token, // Strapi nie używa refresh tokens domyślnie
        userRole: user.rola_uzytkownika,
        userId: user.id_uzytkownika,
        uzytkownik: {
          id_logowania: user.id_logowania,
          id_uzytkownika: user.id_uzytkownika,
          adres_email: user.email,
          rola_uzytkownika: user.rola_uzytkownika,
        },
      };
    } catch (error) {
      return ctx.badRequest("Błąd podczas logowania");
    }
  };

  return plugin;
};
```

## 📦 Skrypt migracji danych

```bash
#!/bin/bash
# migrate-to-strapi.sh

echo "🚀 Rozpoczynanie migracji do Strapi..."

# 1. Backup bazy danych
echo "📦 Tworzenie backup bazy danych..."
pg_dump -U postgres -d your_database > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Instalacja Strapi
echo "⚙️ Instalacja Strapi..."
npx create-strapi-app@latest strapi-backend --typescript --no-run

# 3. Kopiowanie konfiguracji
echo "📋 Kopiowanie konfiguracji..."
cp .env strapi-backend/.env
cp -r migrations/ strapi-backend/migrations/

# 4. Instalacja zależności
cd strapi-backend
npm install xlsx bcryptjs jsonwebtoken joi

# 5. Uruchomienie migracji
echo "🔄 Uruchamianie skryptów migracji..."
npm run strapi migrate:run

echo "✅ Migracja zakończona!"
```

## 🧪 Testy integracyjne

```javascript
// strapi-backend/tests/delivery/delivery.test.js
const request = require("supertest");

describe("Delivery API", () => {
  let authToken;

  beforeAll(async () => {
    const loginResponse = await request(strapi.server)
      .post("/api/auth/login")
      .send({
        adres_email: "test@example.com",
        haslo: "password123",
      });

    authToken = loginResponse.body.token;
  });

  test("Should upload delivery file", async () => {
    const response = await request(strapi.server)
      .post("/api/deliveries/upload")
      .set("Authorization", `Bearer ${authToken}`)
      .attach("deliveryFile", "tests/fixtures/test-delivery.xlsx");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("id_dostawy");
  });

  test("Should get deliveries with pagination", async () => {
    const response = await request(strapi.server)
      .get("/api/deliveries?page=1&limit=10")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.pagination).toBeDefined();
  });
});
```
