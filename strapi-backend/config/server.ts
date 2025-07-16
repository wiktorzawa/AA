export default ({ env }: { env: any }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  // Konfiguracja dla lepszej wydajności w trybie develop
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  // Zmniejszenie częstotliwości restartów
  autoReload: {
    enabled: env.bool('AUTO_RELOAD', true),
    // Ignoruj zmiany w plikach, które nie wymagają restartu
    ignored: [
      '**/node_modules/**',
      '**/build/**',
      '**/dist/**',
      '**/.git/**',
      '**/logs/**',
      '**/tmp/**',
      '**/*.log',
    ],
  },
});
