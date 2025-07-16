module.exports = {
  async afterCreate(event: {
    result: { id: number; nrLotDostawy?: string; idDostawcy: string };
  }) {
    const { result } = event;

    if (result.id) {
      // Generuj deliveryId w formacie DEL/0001
      const id_str = result.id.toString().padStart(4, "0");
      const deliveryId = `DEL/${id_str}`;

      // Generuj idDostawy w formacie DOST/nrLotu/sekwencja
      let idDostawy = deliveryId; // Domyślnie

      if (result.nrLotDostawy && result.idDostawcy) {
        // Policz ile dostaw ma już ten dostawca
        const count = await strapi.db.query("api::delivery.delivery").count({
          where: { idDostawcy: result.idDostawcy },
        });

        const sequence = String(count).padStart(3, "0");
        idDostawy = `DOST/${result.nrLotDostawy}/${sequence}`;
      }

      await strapi.db.query("api::delivery.delivery").update({
        where: { id: result.id },
        data: {
          deliveryId: deliveryId,
          idDostawy: idDostawy,
        },
      });
    }
  },
};
