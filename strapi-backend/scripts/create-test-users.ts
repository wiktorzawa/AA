import bcrypt from "bcryptjs";
import type { Core } from "@strapi/strapi";

async function createTestUsers(strapi: Core.Strapi) {
  console.log("Creating test users...");

  try {
    // Get the authenticated role
    const authenticatedRole = await strapi
      .query("plugin::users-permissions.role")
      .findOne({
        where: { type: "authenticated" },
      });

    if (!authenticatedRole) {
      console.error("Authenticated role not found");
      return;
    }

    // Hash passwords
    const adminPassword = await bcrypt.hash("admin", 10);
    const staffPassword = await bcrypt.hash("staff123", 10);
    const supplierPassword = await bcrypt.hash("supplier123", 10);

    // Create admin user
    const adminUser = await strapi
      .query("plugin::users-permissions.user")
      .create({
        data: {
          username: "admin",
          email: "admin@msbox.com",
          password: adminPassword,
          confirmed: true,
          blocked: false,
          role: authenticatedRole.id,
        },
      });
    console.log("Created admin user:", adminUser.email);

    // Create staff user
    const staffUser = await strapi
      .query("plugin::users-permissions.user")
      .create({
        data: {
          username: "staff",
          email: "staff@msbox.com",
          password: staffPassword,
          confirmed: true,
          blocked: false,
          role: authenticatedRole.id,
        },
      });
    console.log("Created staff user:", staffUser.email);

    // Create supplier user
    const supplierUser = await strapi
      .query("plugin::users-permissions.user")
      .create({
        data: {
          username: "supplier",
          email: "supplier@msbox.com",
          password: supplierPassword,
          confirmed: true,
          blocked: false,
          role: authenticatedRole.id,
        },
      });
    console.log("Created supplier user:", supplierUser.email);

    // Create Staff entries
    await strapi.documents("api::staff.staff").create({
      data: {
        staffId: "STAFF001",
        firstName: "Admin",
        lastName: "User",
        email: "admin@msbox.com",
        phone: "+48123456789",
        position: "admin",
        hireDate: new Date().toISOString().split("T")[0],
        publishedAt: new Date(),
      },
    });
    console.log("Created admin staff profile");

    await strapi.documents("api::staff.staff").create({
      data: {
        staffId: "STAFF002",
        firstName: "Staff",
        lastName: "User",
        email: "staff@msbox.com",
        phone: "+48987654321",
        position: "staff",
        hireDate: new Date().toISOString().split("T")[0],
        publishedAt: new Date(),
      },
    });
    console.log("Created staff profile");

    // Create Supplier entry
    await strapi.documents("api::supplier.supplier").create({
      data: {
        supplierId: "SUP001",
        companyName: "Test Supplier Company",
        contactFirstName: "Supplier",
        contactLastName: "User",
        email: "supplier@msbox.com",
        phone: "+48555666777",
        street: "ul. Testowa",
        buildingNumber: "123",
        city: "Warszawa",
        postalCode: "00-001",
        country: "Polska",
        nip: "1234567890",
        publishedAt: new Date(),
      },
    });
    console.log("Created supplier profile");

    // Set permissions for authenticated role
    const permissions = [
      { action: "api::staff.staff.find", role: authenticatedRole.id },
      { action: "api::staff.staff.findOne", role: authenticatedRole.id },
      { action: "api::supplier.supplier.find", role: authenticatedRole.id },
      { action: "api::supplier.supplier.findOne", role: authenticatedRole.id },
    ];

    for (const perm of permissions) {
      const existingPermission = await strapi
        .query("plugin::users-permissions.permission")
        .findOne({
          where: {
            action: perm.action,
            role: perm.role,
          },
        });

      if (!existingPermission) {
        await strapi.query("plugin::users-permissions.permission").create({
          data: perm,
        });
      }
    }
    console.log("Set permissions for authenticated role");
  } catch (error) {
    console.error("Error creating test users:", error);
  }
}

async function main() {
  const { createStrapi, compileStrapi } = await import("@strapi/strapi");

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = "error";

  await createTestUsers(app);
  await app.destroy();

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
