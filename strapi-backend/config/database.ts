export default ({ env }: { env: any }) => ({
  connection: {
    client: env("DATABASE_CLIENT", "mysql"),
    connection: {
      host: env("DATABASE_HOST", "127.0.0.1"),
      port: env.int("DATABASE_PORT", 3306),
      database: env("DATABASE_NAME", "strapi_db_clean"),
      user: env("DATABASE_USERNAME", "admin"),
      password: env("DATABASE_PASSWORD", "haslo_do_bazy"),
      ssl: env.bool("DATABASE_SSL", false),
    },
    pool: {
      min: 0,
    },
    debug: false,
  },
});
