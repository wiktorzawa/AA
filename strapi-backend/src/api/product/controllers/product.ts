import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::product.product' as any,
  ({ strapi }) => ({
    // Endpoint: GET /api/products/delivery/:deliveryId
    async findByDelivery(ctx) {
      const { deliveryId } = ctx.params;

      const products = await strapi
        .documents('api::product.product' as any)
        .findMany({
          filters: {
            delivery: {
              id: deliveryId,
            },
          } as any,
          populate: {
            delivery: true,
          } as any,
        });

      return {
        success: true,
        data: products,
      };
    },

    // Endpoint: GET /api/products/delivery/:deliveryId/palette/:paletteNumber
    async findByDeliveryAndPalette(ctx) {
      const { deliveryId, paletteNumber } = ctx.params;

      const products = await strapi
        .documents('api::product.product' as any)
        .findMany({
          filters: {
            delivery: {
              id: deliveryId,
            },
            nrPalety: paletteNumber,
          } as any,
          populate: {
            delivery: {
              populate: {
                supplier: true,
              },
            },
          } as any,
        });

      return {
        success: true,
        data: products,
      };
    },

    // Endpoint: GET /api/products/search
    async search(ctx) {
      const { ean, asin, category } = ctx.query;

      const filters: any = {};

      if (ean) {
        filters.kodEan = { $contains: ean };
      }

      if (asin) {
        filters.kodAsin = { $contains: asin };
      }

      if (category) {
        filters.kategoriaProduktu = { $contains: category };
      }

      const products = await strapi
        .documents('api::product.product' as any)
        .findMany({
          filters,
          populate: {
            delivery: {
              populate: {
                supplier: true,
              },
            },
          } as any,
          sort: ['createdAt:desc'],
          pagination: {
            page: ctx.query.page || 1,
            pageSize: ctx.query.pageSize || 25,
          },
        });

      return {
        success: true,
        data: products,
      };
    },

    // Endpoint: GET /api/products/stats/:deliveryId
    async stats(ctx) {
      const { deliveryId } = ctx.params;

      // Pobierz wszystkie produkty z dostawy
      const products = await strapi
        .documents('api::product.product' as any)
        .findMany({
          filters: {
            delivery: {
              id: deliveryId,
            },
          } as any,
        });

      // Oblicz statystyki
      const totalProducts = products.length;
      const totalQuantity = products.reduce(
        (sum: number, p: any) => sum + (p.ilosc || 0),
        0
      );
      const totalValue = products.reduce(
        (sum: number, p: any) =>
          sum + (p.cenaProduktuSpec || 0) * (p.ilosc || 0),
        0
      );

      // Grupuj po paletach
      const productsByPalette: any = {};
      products.forEach((product: any) => {
        const paletteNumber = product.nrPalety || 'Brak palety';
        if (!productsByPalette[paletteNumber]) {
          productsByPalette[paletteNumber] = {
            count: 0,
            quantity: 0,
            value: 0,
          };
        }
        productsByPalette[paletteNumber].count++;
        productsByPalette[paletteNumber].quantity += product.ilosc || 0;
        productsByPalette[paletteNumber].value +=
          (product.cenaProduktuSpec || 0) * (product.ilosc || 0);
      });

      return {
        deliveryId,
        totalProducts,
        totalQuantity,
        totalValue,
        productsByPalette,
      };
    },
  })
);
