import bcrypt from "bcryptjs";

async function verifyPassword() {
  const storedHash =
    "$2b$10$G.rOIYuzKC/WSt7xzY/GQubucbBO7kJw/787XmNvKH4ZNT2okYlHW";
  const testPassword = "admin";

  const isMatch = await bcrypt.compare(testPassword, storedHash);
  console.log("Password 'admin' matches hash:", isMatch);

  // Test with admin123
  const isMatch2 = await bcrypt.compare("admin123", storedHash);
  console.log("Password 'admin123' matches hash:", isMatch2);
}

verifyPassword().catch(console.error);
