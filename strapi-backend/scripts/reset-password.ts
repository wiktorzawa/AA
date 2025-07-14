import bcrypt from "bcryptjs";
import type { Core } from "@strapi/strapi";

async function resetUserPassword(strapi: Core.Strapi) {
  console.log("Resetting user password...");

  try {
    // Find user by email
    const user = await strapi.query("plugin::users-permissions.user").findOne({
      where: { email: "admin@msbox.com" },
    });

    if (!user) {
      console.error("User with email admin@msbox.com not found");
      return;
    }

    console.log("Found user:", user.email, "ID:", user.id);

    // Hash new password
    const newPassword = await bcrypt.hash("admin", 10);

    // Update user password
    await strapi.query("plugin::users-permissions.user").update({
      where: { id: user.id },
      data: {
        password: newPassword,
        confirmed: true,
        blocked: false,
      },
    });

    console.log("Password reset successfully to: admin");
    console.log("User confirmed: true");
    console.log("User blocked: false");
  } catch (error) {
    console.error("Error resetting password:", error);
  }
}

async function main() {
  const { createStrapi, compileStrapi } = await import("@strapi/strapi");

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = "error";

  await resetUserPassword(app);
  await app.destroy();

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
