// export default async (
//   policyContext: any,
//   config: any,
//   { strapi }: { strapi: any }
// ) => {
//   const { user } = policyContext.state;
//   const { id_dostawcy } = policyContext.request.body;

//   strapi.log.info('is-supplier policy', {
//     hasUser: !!user,
//     userId: user?.id,
//     userRole: user?.role?.name,
//     requestedSupplierId: id_dostawcy,
//   });

//   if (!user) {
//     return false;
//   }

//   // Admin i staff mogą wszystko
//   if (user.role?.name === 'admin' || user.role?.name === 'staff') {
//     if (!id_dostawcy) {
//       policyContext.throw(400, 'ID dostawcy jest wymagane');
//     }
//     return true;
//   }

//   // Sprawdź czy użytkownik jest dostawcą
//   if (user.role?.name === 'supplier') {
//     // Znajdź profil dostawcy
//     const supplier = await strapi.entityService.findMany(
//       'api::supplier.supplier',
//       {
//         filters: {
//           user: user.id,
//         },
//         limit: 1,
//       }
//     );

//     if (!supplier || supplier.length === 0) {
//       strapi.log.warn('Supplier profile not found for user', {
//         userId: user.id,
//         email: user.email,
//       });
//       return false;
//     }

//     // Dostawca może przesyłać tylko swoje dostawy
//     if (id_dostawcy && id_dostawcy !== supplier[0].supplierId) {
//       strapi.log.warn('Supplier trying to upload for different supplier', {
//         requestedSupplierId: id_dostawcy,
//         userSupplierId: supplier[0].supplierId,
//       });
//       return false;
//     }

//     // Jeśli nie podano ID dostawcy, ustaw je automatycznie
//     if (!id_dostawcy) {
//       policyContext.request.body.id_dostawcy = supplier[0].supplierId;
//     }

//     return true;
//   }

//   return false;
// };
