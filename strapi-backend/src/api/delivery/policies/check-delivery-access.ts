export default async (
  policyContext: any,
  config: any,
  { strapi }: { strapi: any }
) => {
  const { user } = policyContext.state;
  const { id } = policyContext.params;

  if (!user) {
    return false;
  }

  // Pobierz rolę użytkownika
  const userWithRole = await strapi.entityService.findOne(
    'plugin::users-permissions.user',
    user.id,
    {
      populate: ['role'],
    }
  );

  const roleName = userWithRole?.role?.type || userWithRole?.role?.name;

  // Admin i staff mogą widzieć wszystkie dostawy
  if (roleName === 'admin' || roleName === 'staff') {
    return true;
  }

  // Sprawdź czy użytkownik jest dostawcą
  if (roleName === 'supplier') {
    // Znajdź profil dostawcy
    const supplier = await strapi.entityService.findMany(
      'api::supplier.supplier',
      {
        filters: {
          user: user.id,
        },
        limit: 1,
      }
    );

    if (!supplier || supplier.length === 0) {
      strapi.log.warn('Supplier not found for user', {
        userId: user.id,
        email: user.email,
      });
      return false;
    }

    // Znajdź dostawę
    const delivery = await strapi.entityService.findOne(
      'api::delivery.delivery',
      id,
      {
        fields: ['idDostawcy'],
      }
    );

    if (!delivery) {
      strapi.log.warn('Delivery not found', { deliveryId: id });
      return false;
    }

    // Sprawdź czy dostawa należy do tego dostawcy
    if (delivery.idDostawcy !== supplier[0].supplierId) {
      strapi.log.warn('Delivery access denied', {
        deliveryId: id,
        deliverySupplierId: delivery.idDostawcy,
        userSupplierId: supplier[0].supplierId,
      });
      return false;
    }

    return true;
  }

  // Domyślnie odmów dostępu
  return false;
};
