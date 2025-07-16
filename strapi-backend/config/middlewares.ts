export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  // Temporarily disabled response-formatter middleware to fix auth issues
  // {
  //   name: "global::response-formatter",
  //   config: {},
  // },
];
