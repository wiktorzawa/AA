interface CanUploadDeliveryConfig {} // Możesz rozszerzyć w razie potrzeby

const canUploadDelivery = async (
  policyContext: any,
  config: CanUploadDeliveryConfig,
  { strapi }: { strapi: any }
) => {
  const { user } = policyContext.state;
  const { id_dostawcy } = policyContext.request.body;

  strapi.log.info('can-upload-delivery policy START', {
    hasUser: !!user,
    userId: user?.id,
    userEmail: user?.email,
    userDocumentId: user?.documentId,
    requestedSupplierId: id_dostawcy,
    userObject: JSON.stringify(user),
  });

  if (!user) {
    strapi.log.error('No user in context');
    return false;
  }

  // Pobierz rolę użytkownika z JWT/Strapi user
  try {
    // W Strapi 5 user.id to jest już documentId
    const userWithRole = await strapi.db
      .query('plugin::users-permissions.user')
      .findOne({
        where: { id: user.id },
        populate: ['role', 'staff_profile', 'supplier_profile'],
      });

    strapi.log.info('Found user with role:', {
      userId: userWithRole?.id,
      email: userWithRole?.email,
      roleName: userWithRole?.role?.name,
      roleType: userWithRole?.role?.type,
      hasStaffProfile: !!userWithRole?.staff_profile,
      hasSupplierProfile: !!userWithRole?.supplier_profile,
    });

    const roleName = userWithRole?.role?.type || userWithRole?.role?.name;

    // Admin i staff mogą wszystko
    if (roleName === 'admin' || roleName === 'staff') {
      if (!id_dostawcy) {
        policyContext.throw(400, 'ID dostawcy jest wymagane');
      }
      return true;
    }

    // Sprawdź czy użytkownik jest dostawcą
    if (roleName === 'supplier') {
      // Znajdź profil dostawcy powiązany z użytkownikiem
      const suppliers = await strapi.db
        .query('api::supplier.supplier')
        .findMany({
          where: {
            user: user.id,
          },
          limit: 1,
        });

      strapi.log.info('Found suppliers:', {
        count: suppliers?.length || 0,
        supplierId: suppliers?.[0]?.supplierId,
      });

      if (!suppliers || suppliers.length === 0) {
        strapi.log.warn('Supplier profile not found for user', {
          userId: user.id,
          email: user.email,
        });
        return false;
      }

      const supplier = suppliers[0];

      // Dostawca może przesyłać tylko swoje dostawy
      if (id_dostawcy && id_dostawcy !== supplier.supplierId) {
        strapi.log.warn('Supplier trying to upload for different supplier', {
          requestedSupplierId: id_dostawcy,
          userSupplierId: supplier.supplierId,
        });
        return false;
      }

      // Jeśli nie podano ID dostawcy, ustaw je automatycznie
      if (!id_dostawcy) {
        policyContext.request.body.id_dostawcy = supplier.supplierId;
      }

      return true;
    }

    strapi.log.warn('User has invalid role', { roleName });
    return false;
  } catch (error) {
    strapi.log.error('Error in can-upload-delivery policy:', error);
    return false;
  }
};

export default canUploadDelivery;
