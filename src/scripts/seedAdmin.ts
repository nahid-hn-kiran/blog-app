import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

const seedAdmin = async () => {
  try {
    const adminData = {
      name: "Nahid Hasan",
      email: "nahidhasankira343n@gmail.com",
      password: "Nahid123@A",
      role: UserRole.ADMIN,
    };
    // Check if the admin user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email },
    });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const signUpAdmin = await fetch(
      "http://localhost:3000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      },
    );

    console.log(signUpAdmin);
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};

seedAdmin();
