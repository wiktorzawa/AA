export default {
  routes: [
    {
      method: "GET",
      path: "/products/delivery/:deliveryId",
      handler: "product.findByDelivery",
      config: {
        policies: ["global::is-authenticated"],
      },
    },
    {
      method: "GET",
      path: "/products/delivery/:deliveryId/palette/:paletteNumber",
      handler: "product.findByDeliveryAndPalette",
      config: {
        policies: ["global::is-authenticated"],
      },
    },
    {
      method: "GET",
      path: "/products/search",
      handler: "product.search",
      config: {
        policies: ["global::is-authenticated"],
      },
    },
    {
      method: "GET",
      path: "/products/stats/:deliveryId",
      handler: "product.stats",
      config: {
        policies: ["api::delivery.check-delivery-access"],
      },
    },
  ],
};
