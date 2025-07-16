module.exports = {
  async afterCreate(event: { result: { id: number } }) {
    const { result } = event;

    if (result.id) {
      // Generuj productId w formacie PROD/0001
      const id_str = result.id.toString().padStart(4, "0");
      const productId = `PROD/${id_str}`;

      // Generuj idProduktu z losowym numerem
      const randomNumber = Math.random().toString().slice(2, 10);
      const idProduktu = `PROD/${randomNumber}`;

      await strapi.db.query("api::product.product").update({
        where: { id: result.id },
        data: {
          productId: productId,
          idProduktu: idProduktu,
        },
      });
    }
  },
};
