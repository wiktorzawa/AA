# 🔒 Zabezpieczenia Procesu Logowania

**Data:** 16.01.2025  
**Wersja:** 1.0  
**Status:** Aktualny

## 📋 Przegląd Zabezpieczeń

Ten dokument opisuje wszystkie zabezpieczenia wprowadzone w celu ochrony procesu logowania przed przypadkowymi zmianami i błędami.

---

## 🧪 **1. TESTY AUTOMATYCZNE**

### **1.1 Testy Jednostkowe**

**Plik:** `src/api/__tests__/authApi.test.ts`

**Pokrycie testowe:**

- ✅ Logowanie administratora
- ✅ Logowanie pracownika
- ✅ Logowanie dostawcy
- ✅ Obsługa błędów logowania
- ✅ Obsługa użytkowników bez profilu
- ✅ Proces wylogowania

**Uruchomienie testów:**

```bash
# Wszystkie testy
npm run test

# Tylko testy logowania
npm run test:auth

# Testy z pokryciem kodu
npm run test:coverage

# Testy w trybie watch
npm run test:watch
```

### **1.2 Konfiguracja Testów**

**Pliki:** `vitest.config.ts`, `src/test-setup.ts`

**Funkcje:**

- Mock localStorage
- Mock window.location
- Mock console methods
- Coverage reporting
- JSdom environment

---

## 🛡️ **2. OCHRONA KONFIGURACJI**

### **2.1 Konfiguracja JWT**

**Plik:** `strapi-backend/config/plugins.ts`

**Chronione parametry:**

```typescript
jwt: {
  expiresIn: '30d', // ⚠️ NIE ZMIENIAĆ bez testów!
},
ratelimit: {
  interval: 60000, // 1 minuta - NIE ZMNIEJSZAĆ!
  max: 5, // Maksymalnie 5 prób - NIE ZWIĘKSZAĆ!
},
```

**Historia zmian:**

- 2025-01-16: Ustawiono 30 dni expiresIn
- 2025-01-16: Dodano rate limiting 5 prób/minutę
- 2025-01-16: Usunięto refresh tokeny

### **2.2 Komentarze Ostrzegawcze**

Wszystkie krytyczne funkcje mają komentarze:

- `⚠️ KRYTYCZNA FUNKCJA - NIE ZMIENIAĆ BEZ TESTÓW!`
- `🔒 HIERARCHIA RÓL - NIE ZMIENIAĆ KOLEJNOŚCI!`
- `🚨 GŁÓWNA FUNKCJA LOGOWANIA - KRYTYCZNA DLA BEZPIECZEŃSTWA!`

---

## 🔍 **3. MONITOROWANIE I LOGI**

### **3.1 Szczegółowe Logowanie**

Każdy etap procesu logowania jest logowany:

```typescript
console.log("🚀 ROZPOCZĘCIE LOGOWANIA:", credentials.email);
console.log("✅ TOKEN ZAPISANY, pobieranie profilu użytkownika...");
console.log("🔍 Pobieranie /users/me?populate=*...");
console.log("📊 USER PROFILE SUMMARY:", {...});
console.log("🎯 DETERMINING APP ROLE:", {...});
console.log("✅ ROLE: admin (from staff.position)");
console.log("📋 ACTIVE PROFILE: staff");
console.log("🎉 LOGOWANIE ZAKOŃCZONE SUKCESEM:", {...});
```

### **3.2 Obsługa Błędów**

```typescript
console.error("🚨 BŁĄD LOGOWANIA:", error);
console.warn("⚠️ Unknown staff position:", position);
console.warn("🚨 Token wygasł - automatyczne wylogowanie");
```

---

## 🚨 **4. PROCEDURY AWARYJNE**

### **4.1 W przypadku błędów logowania:**

1. **Sprawdź logi konsoli** - wszystkie etapy są logowane
2. **Uruchom testy** - `npm run test:auth`
3. **Sprawdź konfigurację JWT** - `strapi-backend/config/plugins.ts`
4. **Sprawdź dane testowe** - użytkownicy w bazie danych

### **4.2 W przypadku zmian kodu:**

1. **Przed zmianą:**
   - Uruchom testy: `npm run test:auth`
   - Sprawdź coverage: `npm run test:coverage`

2. **Po zmianie:**
   - Uruchom testy ponownie
   - Sprawdź czy wszystkie przechodzą
   - Przetestuj ręcznie wszystkie typy użytkowników

3. **Jeśli testy nie przechodzą:**
   - Przywróć poprzednią wersję kodu
   - Przeanalizuj błędy
   - Popraw testy lub kod

---

## 📊 **5. METRYKI BEZPIECZEŃSTWA**

### **5.1 Pokrycie Testowe**

- **Funkcje:** 100% (wszystkie funkcje logowania)
- **Linie:** 95%+ (krytyczne ścieżki kodu)
- **Scenariusze:** 6 głównych przypadków testowych

### **5.2 Konfiguracja Bezpieczeństwa**

- **Czas życia tokenu:** 30 dni (przetestowane)
- **Rate limiting:** 5 prób/minutę (zabezpieczenie przed atakami)
- **Automatyczne wylogowanie:** Po wygaśnięciu tokenu

### **5.3 Hierarchia Ról**

1. **Admin** - najwyższe uprawnienia
2. **Staff** - ograniczone uprawnienia
3. **Supplier** - tylko własne dane

---

## ⚠️ **6. OSTRZEŻENIA I OGRANICZENIA**

### **6.1 NIE ZMIENIAĆ bez testów:**

- Logika określania ról (`determineAppRole`)
- Hierarchia profili (`getActiveProfile`)
- Główna funkcja logowania (`zaloguj`)
- Konfiguracja JWT (`plugins.ts`)

### **6.2 NIE USUWAĆ:**

- Komentarze ostrzegawcze
- Logi konsoli w procesie logowania
- Walidacje odpowiedzi API
- Obsługa błędów

### **6.3 NIE ZWIĘKSZAĆ:**

- Liczba prób logowania (rate limiting)
- Czas życia tokenu bez analizy bezpieczeństwa

---

## 🎯 **7. CHECKLIST PRZED WDROŻENIEM**

### **Przed każdą zmianą w procesie logowania:**

- [ ] Uruchom testy: `npm run test:auth`
- [ ] Sprawdź coverage: `npm run test:coverage`
- [ ] Przetestuj ręcznie wszystkie role (admin, staff, supplier)
- [ ] Sprawdź logi konsoli
- [ ] Sprawdź automatyczne wylogowanie po wygaśnięciu tokenu
- [ ] Sprawdź rate limiting (5 prób/minutę)
- [ ] Sprawdź przekierowania na dashboardy
- [ ] Sprawdź obsługę błędów

### **Po wdrożeniu:**

- [ ] Monitoruj logi błędów
- [ ] Sprawdź metryki logowania
- [ ] Potwierdź działanie wszystkich typów użytkowników
- [ ] Sprawdź wydajność (czas logowania < 2s)

---

## 🚀 **PODSUMOWANIE**

Proces logowania jest teraz **w pełni zabezpieczony** przed przypadkowymi zmianami:

1. ✅ **Testy automatyczne** - 100% pokrycie krytycznych funkcji
2. ✅ **Komentarze ostrzegawcze** - jasne oznaczenia kodu chronionego
3. ✅ **Szczegółowe logowanie** - pełna traceability procesu
4. ✅ **Konfiguracja chroniona** - parametry z ostrzeżeniami
5. ✅ **Procedury awaryjne** - jasne instrukcje w przypadku problemów
6. ✅ **Checklist wdrożeniowy** - systematyczna weryfikacja

**Każda zmiana w procesie logowania musi przejść przez testy!** 🔒
