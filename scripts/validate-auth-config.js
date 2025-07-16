#!/usr/bin/env node

/**
 * 🔒 Skrypt Walidacji Konfiguracji Procesu Logowania
 *
 * Sprawdza czy konfiguracja procesu logowania jest poprawna
 * i zgodna z wymaganiami bezpieczeństwa.
 *
 * Użycie: node scripts/validate-auth-config.js
 */

const fs = require("fs");
const path = require("path");

// Kolory dla konsoli
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateFile(filePath, description) {
  if (!fs.existsSync(filePath)) {
    log(`❌ BŁĄD: Brak pliku ${filePath} (${description})`, "red");
    return false;
  }
  log(`✅ OK: ${filePath} (${description})`, "green");
  return true;
}

function validateJWTConfig() {
  log("\n🔍 Sprawdzanie konfiguracji JWT...", "blue");

  const pluginsPath = path.join(
    __dirname,
    "..",
    "strapi-backend",
    "config",
    "plugins.ts"
  );

  if (!validateFile(pluginsPath, "Konfiguracja pluginów Strapi")) {
    return false;
  }

  const content = fs.readFileSync(pluginsPath, "utf8");

  // Sprawdź czy jest konfiguracja JWT
  if (!content.includes("jwt:")) {
    log("❌ BŁĄD: Brak konfiguracji JWT w plugins.ts", "red");
    return false;
  }

  // Sprawdź czas życia tokenu
  if (!content.includes("expiresIn:")) {
    log("❌ BŁĄD: Brak konfiguracji expiresIn w JWT", "red");
    return false;
  }

  // Sprawdź czy jest 30 dni
  if (!content.includes("'30d'")) {
    log(
      "⚠️  OSTRZEŻENIE: Czas życia tokenu nie jest ustawiony na 30 dni",
      "yellow"
    );
  } else {
    log("✅ OK: Czas życia tokenu ustawiony na 30 dni", "green");
  }

  // Sprawdź rate limiting
  if (!content.includes("ratelimit:")) {
    log("❌ BŁĄD: Brak konfiguracji rate limiting", "red");
    return false;
  }

  if (!content.includes("max: 5")) {
    log(
      "⚠️  OSTRZEŻENIE: Rate limiting nie jest ustawiony na 5 prób",
      "yellow"
    );
  } else {
    log("✅ OK: Rate limiting ustawiony na 5 prób/minutę", "green");
  }

  return true;
}

function validateAuthFiles() {
  log("\n🔍 Sprawdzanie plików procesu logowania...", "blue");

  const files = [
    ["src/api/authApi.ts", "Główna logika logowania"],
    ["src/stores/authStore.ts", "Store uwierzytelniania"],
    ["src/api/strapiAdapter.ts", "Adapter komunikacji z Strapi"],
    ["src/components/authentication/ProtectedRoute.tsx", "Ochrona tras"],
    [
      "src/components/authentication/RoleBasedRedirect.tsx",
      "Przekierowania ról",
    ],
  ];

  let allValid = true;

  files.forEach(([filePath, description]) => {
    if (!validateFile(filePath, description)) {
      allValid = false;
    }
  });

  return allValid;
}

function validateAuthApiContent() {
  log("\n🔍 Sprawdzanie zawartości authApi.ts...", "blue");

  const authApiPath = path.join(__dirname, "..", "src", "api", "authApi.ts");
  const content = fs.readFileSync(authApiPath, "utf8");

  const requiredFunctions = [
    "determineAppRole",
    "getActiveProfile",
    "zaloguj",
    "wyloguj",
  ];

  let allValid = true;

  requiredFunctions.forEach((func) => {
    if (!content.includes(func)) {
      log(`❌ BŁĄD: Brak funkcji ${func} w authApi.ts`, "red");
      allValid = false;
    } else {
      log(`✅ OK: Funkcja ${func} istnieje`, "green");
    }
  });

  // Sprawdź czy są komentarze ostrzegawcze
  const warningComments = [
    "KRYTYCZNA FUNKCJA",
    "NIE ZMIENIAĆ",
    "HIERARCHIA RÓL",
  ];

  warningComments.forEach((comment) => {
    if (!content.includes(comment)) {
      log(
        `⚠️  OSTRZEŻENIE: Brak komentarza ostrzegawczego "${comment}"`,
        "yellow"
      );
    } else {
      log(`✅ OK: Komentarz ostrzegawczy "${comment}" obecny`, "green");
    }
  });

  return allValid;
}

function validateStrapiAdapter() {
  log("\n🔍 Sprawdzanie strapiAdapter.ts...", "blue");

  const adapterPath = path.join(
    __dirname,
    "..",
    "src",
    "api",
    "strapiAdapter.ts"
  );
  const content = fs.readFileSync(adapterPath, "utf8");

  // Sprawdź interceptory
  if (!content.includes("interceptors.request.use")) {
    log("❌ BŁĄD: Brak request interceptora", "red");
    return false;
  }

  if (!content.includes("interceptors.response.use")) {
    log("❌ BŁĄD: Brak response interceptora", "red");
    return false;
  }

  // Sprawdź obsługę 401
  if (!content.includes("401")) {
    log("❌ BŁĄD: Brak obsługi błędu 401", "red");
    return false;
  }

  // Sprawdź automatyczne wylogowanie
  if (!content.includes("logout()")) {
    log("❌ BŁĄD: Brak automatycznego wylogowania", "red");
    return false;
  }

  log("✅ OK: strapiAdapter poprawnie skonfigurowany", "green");
  return true;
}

function validateConstants() {
  log("\n🔍 Sprawdzanie constants.ts...", "blue");

  const constantsPath = path.join(__dirname, "..", "src", "constants.ts");
  const content = fs.readFileSync(constantsPath, "utf8");

  // Sprawdź czy nie ma refresh tokenów
  if (content.includes("refresh") || content.includes("REFRESH")) {
    log("⚠️  OSTRZEŻENIE: Znaleziono referencje do refresh tokenów", "yellow");
    return false;
  }

  // Sprawdź endpointy
  const requiredEndpoints = ["LOGIN", "ME", "LOGOUT"];

  let allValid = true;

  requiredEndpoints.forEach((endpoint) => {
    if (!content.includes(endpoint)) {
      log(`❌ BŁĄD: Brak endpointu ${endpoint}`, "red");
      allValid = false;
    } else {
      log(`✅ OK: Endpoint ${endpoint} zdefiniowany`, "green");
    }
  });

  return allValid;
}

function main() {
  log("🔒 WALIDACJA KONFIGURACJI PROCESU LOGOWANIA", "blue");
  log("=".repeat(50), "blue");

  const validations = [
    validateAuthFiles,
    validateJWTConfig,
    validateAuthApiContent,
    validateStrapiAdapter,
    validateConstants,
  ];

  let allPassed = true;

  validations.forEach((validation) => {
    if (!validation()) {
      allPassed = false;
    }
  });

  log("\n" + "=".repeat(50), "blue");

  if (allPassed) {
    log("🎉 WSZYSTKIE WALIDACJE PRZESZŁY POMYŚLNIE!", "green");
    log("Proces logowania jest poprawnie skonfigurowany.", "green");
    process.exit(0);
  } else {
    log("❌ NIEKTÓRE WALIDACJE NIE POWIODŁY SIĘ!", "red");
    log("Sprawdź błędy powyżej i popraw konfigurację.", "red");
    process.exit(1);
  }
}

// Uruchom walidację
main();
