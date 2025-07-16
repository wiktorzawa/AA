export default {
  // ⚠️ KRYTYCZNA KONFIGURACJA - NIE ZMIENIAĆ BEZ TESTÓW!
  // Konfiguracja Users & Permissions Plugin
  'users-permissions': {
    config: {
      // 🔒 KONFIGURACJA JWT - CHRONIONA PRZED ZMIANAMI
      jwt: {
        // ⚠️ UWAGA: Zmiana czasu życia tokenu wpływa na bezpieczeństwo!
        // Obecna wartość: 30 dni - przetestowana i zatwierdzona
        expiresIn: '30d', // NIE ZMIENIAĆ bez aktualizacji testów!
      },
      // 🛡️ RATE LIMITING - OCHRONA PRZED ATAKAMI
      ratelimit: {
        // Ograniczenie prób logowania - KRYTYCZNE dla bezpieczeństwa
        interval: 60000, // 1 minuta - NIE ZMNIEJSZAĆ!
        max: 5, // Maksymalnie 5 prób na minutę - NIE ZWIĘKSZAĆ!
      },
      // 📝 HISTORIA ZMIAN:
      // 2025-01-16: Ustawiono 30 dni expiresIn (poprzednio domyślne 7 dni)
      // 2025-01-16: Dodano rate limiting 5 prób/minutę
      // 2025-01-16: Usunięto refresh tokeny (nie są potrzebne)
    },
  },
};
