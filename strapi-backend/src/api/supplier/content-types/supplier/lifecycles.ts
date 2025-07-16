module.exports = {
  async afterCreate(event: { result: { id: number } }) {
    const { result } = event;

    if (result.id) {
      const id_str = result.id.toString().padStart(4, "0");
      const supplierId = `SUP/${id_str}`;

      await strapi.db.query("api::supplier.supplier").update({
        where: { id: result.id },
        data: {
          supplierId: supplierId,
        },
      });
    }
  },
};
