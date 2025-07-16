module.exports = {
  async afterCreate(event: { result: { id: number; position: string } }) {
    const { result } = event;

    if (result.id) {
      const id_str = result.id.toString().padStart(4, "0");
      const prefix = result.position === "admin" ? "ADM" : "STF";
      const staffId = `${prefix}/${id_str}`;

      await strapi.db.query("api::staff.staff").update({
        where: { id: result.id },
        data: {
          staffId: staffId,
        },
      });
    }
  },
};
