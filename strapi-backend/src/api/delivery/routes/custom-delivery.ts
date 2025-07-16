export default {
  routes: [
    {
      method: 'GET',
      path: '/deliveries/supplier/:supplierId',
      handler: 'delivery.findBySupplier',
      config: {
        policies: ['global::is-authenticated'],
      },
    },
    {
      method: 'GET',
      path: '/deliveries/:id/analyze',
      handler: 'delivery.analyze',
      config: {
        policies: ['api::delivery.check-delivery-access'],
      },
    },
    {
      method: 'POST',
      path: '/deliveries/upload',
      handler: 'delivery.uploadFile',
      config: {
        policies: ['api::delivery.can-upload-delivery'],
        middlewares: ['api::delivery.validate-file-upload'],
      },
    },
    {
      method: 'POST',
      path: '/deliveries/preview',
      handler: 'delivery.previewFile',
      config: {
        policies: ['global::is-authenticated'],
        middlewares: ['api::delivery.validate-file-upload'],
      },
    },
    {
      method: 'POST',
      path: '/deliveries/confirm',
      handler: 'delivery.confirmDelivery',
      config: {
        policies: ['api::delivery.can-upload-delivery'],
        middlewares: ['api::delivery.validate-file-upload'],
      },
    },
    {
      method: 'POST',
      path: '/deliveries/:id/finances',
      handler: 'delivery.createFinances',
      config: {
        policies: ['api::delivery.check-delivery-access'],
      },
    },
    {
      method: 'GET',
      path: '/deliveries/:id/products',
      handler: 'delivery.getProducts',
      config: {
        policies: ['api::delivery.check-delivery-access'],
      },
    },
  ],
};
