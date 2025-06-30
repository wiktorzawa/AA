# 🚨 **WAŻNE OSTRZEŻENIE PRZED ROZPOCZĘCIEM** 🚨

## ⚠️ **UWAGA: Konfiguracja środowiska wymagana!**

**Przed uruchomieniem aplikacji po sklonowaniu z GitHub:**

1. **Pliki `.env` NIE SĄ w repozytorium** (ze względów bezpieczeństwa)
2. **Musisz je stworzyć lokalnie** z własnymi danymi AWS i bazy danych
3. **Bez nich aplikacja NIE BĘDZIE DZIAŁAĆ**

### 🔧 **Wymagane pliki konfiguracyjne:**

```
backend/.env        - Konfiguracja backendu (AWS, baza produkcyjna)
backend/.env.test   - Konfiguracja testów (baza testowa)
.env               - Konfiguracja frontendu (jeśli potrzebna)
```

### 📋 **Minimalna zawartość backend/.env:**

```env
# Database
DB_HOST=your-rds-endpoint
DB_PASSWORD=your-password
# AWS
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
# Security
JWT_SECRET=your-jwt-secret
```

### 📋 **Minimalna zawartość backend/.env.test:**

```env
# Test Database (WAŻNE: inna baza niż produkcyjna!)
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your-test-password
DB_NAME=msbox_test_db
JWT_SECRET=your-jwt-secret
```

**💡 Zobacz `SYSTEM_UPLOAD_DOKUMENTACJA.md` dla pełnych instrukcji konfiguracji**

---

# MSBOX - System Zarządzania Dostawami

System React + TypeScript + Node.js z integracją AWS do zarządzania dostawami Excel.

## Funkcjonalności

- ✅ Upload plików Excel (.xlsx, .xls, .xlsm)
- ✅ Integracja AWS S3 + RDS
- ✅ Autoryzacja JWT (supplier, staff, admin)
- ✅ Inteligentne mapowanie kolumn Excel
- ✅ Walidacja plików i ochrona przed duplikatami

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
