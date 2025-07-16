# ✅ Checklist Weryfikacji Procesu Logowania

**Data:** 16.01.2025  
**Cel:** Ręczna weryfikacja procesu logowania przed wdrożeniem zmian

---

## 🔍 **PRZED KAŻDĄ ZMIANĄ**

### **1. Backup Kodu**

- [ ] Stwórz kopię zapasową pliku `src/api/authApi.ts`
- [ ] Stwórz kopię zapasową pliku `src/stores/authStore.ts`
- [ ] Stwórz kopię zapasową pliku `strapi-backend/config/plugins.ts`

### **2. Dokumentacja Zmian**

- [ ] Opisz dokładnie, co zamierzasz zmienić
- [ ] Określ powód zmiany
- [ ] Zapisz obecne zachowanie systemu

---

## 🧪 **TESTY RĘCZNE - WSZYSTKIE ROLE**

### **Test 1: Logowanie Administratora**

- [ ] Otwórz `http://localhost:5174/authentication/sign-in`
- [ ] Wprowadź: `admin@msbox.com` / `admin`
- [ ] Kliknij "Zaloguj się"
- [ ] **Oczekiwany rezultat:** Przekierowanie na `/admin/dashboard`
- [ ] **Sprawdź logi konsoli:** Powinny zawierać `✅ ROLE: admin`

### **Test 2: Logowanie Pracownika**

- [ ] Wyloguj się (jeśli zalogowany)
- [ ] Wprowadź: `staff@msbox.com` / `staff123`
- [ ] Kliknij "Zaloguj się"
- [ ] **Oczekiwany rezultat:** Przekierowanie na `/staff/dashboard`
- [ ] **Sprawdź logi konsoli:** Powinny zawierać `✅ ROLE: staff`

### **Test 3: Logowanie Dostawcy**

- [ ] Wyloguj się (jeśli zalogowany)
- [ ] Wprowadź: `supplier@msbox.com` / `supplier123`
- [ ] Kliknij "Zaloguj się"
- [ ] **Oczekiwany rezultat:** Przekierowanie na `/supplier/dashboard`
- [ ] **Sprawdź logi konsoli:** Powinny zawierać `✅ ROLE: supplier`

### **Test 4: Błędne Logowanie**

- [ ] Wyloguj się (jeśli zalogowany)
- [ ] Wprowadź: `wrong@email.com` / `wrongpassword`
- [ ] Kliknij "Zaloguj się"
- [ ] **Oczekiwany rezultat:** Komunikat o błędzie
- [ ] **Sprawdź logi konsoli:** Powinny zawierać `🚨 BŁĄD LOGOWANIA`

---

## 🔒 **TESTY BEZPIECZEŃSTWA**

### **Test 5: Wygaśnięcie Tokenu**

- [ ] Zaloguj się jako dowolny użytkownik
- [ ] W konsoli przeglądarki wykonaj: `localStorage.removeItem('token')`
- [ ] Odśwież stronę
- [ ] Spróbuj wykonać akcję wymagającą autoryzacji
- [ ] **Oczekiwany rezultat:** Automatyczne wylogowanie i przekierowanie

### **Test 6: Rate Limiting**

- [ ] Spróbuj zalogować się 6 razy z błędnymi danymi
- [ ] **Oczekiwany rezultat:** Po 5 próbach blokada na 1 minutę

### **Test 7: Długość Tokenu**

- [ ] Zaloguj się jako dowolny użytkownik
- [ ] W konsoli sprawdź: `localStorage.getItem('token')`
- [ ] **Oczekiwany rezultat:** Token JWT (3 części oddzielone kropkami)

---

## 📊 **TESTY WYDAJNOŚCI**

### **Test 8: Czas Logowania**

- [ ] Otwórz DevTools → Network
- [ ] Zaloguj się jako dowolny użytkownik
- [ ] Zmierz czas od kliknięcia do przekierowania
- [ ] **Oczekiwany rezultat:** < 2 sekundy

### **Test 9: Liczba Requestów**

- [ ] Otwórz DevTools → Network
- [ ] Zaloguj się jako dowolny użytkownik
- [ ] Policz liczbę zapytań API
- [ ] **Oczekiwany rezultat:** 2 zapytania (auth/local + users/me)

---

## 🔍 **TESTY LOGÓW**

### **Test 10: Szczegółowość Logów**

Sprawdź czy w konsoli pojawiają się następujące logi:

- [ ] `🚀 ROZPOCZĘCIE LOGOWANIA: [email]`
- [ ] `✅ TOKEN ZAPISANY, pobieranie profilu użytkownika...`
- [ ] `🔍 Pobieranie /users/me?populate=*...`
- [ ] `📊 USER PROFILE SUMMARY:`
- [ ] `🎯 DETERMINING APP ROLE:`
- [ ] `✅ ROLE: [role]`
- [ ] `📋 ACTIVE PROFILE: [profile]`
- [ ] `🎉 LOGOWANIE ZAKOŃCZONE SUKCESEM:`

---

## 🚨 **TESTY AWARYJNE**

### **Test 11: Brak Profilu**

- [ ] W bazie danych usuń profil użytkownika (tymczasowo)
- [ ] Spróbuj się zalogować tym użytkownikiem
- [ ] **Oczekiwany rezultat:** Błąd "Nie można określić roli użytkownika"

### **Test 12: Nieprawidłowa Position**

- [ ] W bazie danych zmień position na "invalid"
- [ ] Spróbuj się zalogować tym użytkownikiem
- [ ] **Oczekiwany rezultat:** Błąd "Nieznana rola w polu position"

### **Test 13: Brak Strapi**

- [ ] Zatrzymaj backend Strapi
- [ ] Spróbuj się zalogować
- [ ] **Oczekiwany rezultat:** Komunikat o błędzie połączenia

---

## ✅ **PODSUMOWANIE WERYFIKACJI**

### **Wszystkie testy przeszły pomyślnie:**

- [ ] **Logowanie** - wszystkie 3 role działają
- [ ] **Bezpieczeństwo** - rate limiting i wygaśnięcie tokenów
- [ ] **Wydajność** - czas < 2s, 2 zapytania
- [ ] **Logi** - wszystkie etapy są logowane
- [ ] **Awarie** - błędy są obsługiwane

### **Podpis weryfikacji:**

- **Data:** ****\_\_\_****
- **Osoba weryfikująca:** ****\_\_\_****
- **Wersja kodu:** ****\_\_\_****
- **Wynik:** ✅ POZYTYWNY / ❌ NEGATYWNY

---

## 🚀 **INSTRUKCJE WDROŻENIA**

Jeśli wszystkie testy przeszły pomyślnie:

1. **Stwórz commit z opisem zmian**
2. **Uruchom aplikację na środowisku testowym**
3. **Przeprowadź testy ponownie**
4. **Wdróż na produkcję**
5. **Monitoruj logi przez pierwsze 24h**

Jeśli jakikolwiek test nie przeszedł:

1. **Przywróć backup kodu**
2. **Przeanalizuj przyczynę błędu**
3. **Popraw kod**
4. **Powtórz testy**
