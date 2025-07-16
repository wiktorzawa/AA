// export default (/* config, { strapi } */) => {
//   return async (ctx: any, next: any) => {
//     await next();

//     // Formatuj odpowiedź tylko dla API endpoints (ale nie auth)
//     if (ctx.url.startsWith('/api/') && !ctx.url.startsWith('/api/auth/')) {
//       const originalBody = ctx.body;

//       // Jeśli odpowiedź już ma format success/error, nie modyfikuj
//       if (
//         originalBody &&
//         typeof originalBody === 'object' &&
//         'success' in originalBody
//       ) {
//         return;
//       }

//       // Formatuj odpowiedź na standardowy format
//       if (ctx.status >= 200 && ctx.status < 300) {
//         ctx.body = {
//           success: true,
//           data: originalBody,
//         };
//       } else {
//         ctx.body = {
//           success: false,
//           error: originalBody?.message || 'Wystąpił błąd',
//           details: originalBody,
//         };
//       }
//     }
//   };
// };
