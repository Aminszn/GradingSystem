const path = require("path");
const result = require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});


console.log("dotenv result:", result);
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const UserService = require("../src/users/services/userService");
const UserBuilder = require("../src/users/models/userBuilder");

const userService = new UserService();

/**
 * ==============================
 * Test User Model Creation
 * ==============================
 */
console.log("Testing User Model Creation...");
try {
  const user = UserBuilder.create()
    .setData({
      userId: "STU_001",
      password: "hashed_password_example"
    })
    .build();

  console.log("User Model Created Successfully:", user);
} catch (error) {
  console.error("Error creating User Model:", error.message);
}

/**
 * ==============================
 * Test Schema Validation (Invalid Data)
 * ==============================
 */
console.log("Testing schema validation (invalid data)...");
try {
  UserBuilder.create()
    .setData({
      userId: "",           // ❌ invalid
      // password missing   // ❌ required
    })
    .build();

  console.error("❌ Schema validation failed to catch errors.");
} catch (error) {
  console.log("Schema validation error caught successfully:", error.message);
}

/**
 * ==============================
 * Test User Service – Admin Registration
 * ==============================
 */
(async () => {
  console.log("Testing User Registration (Admin-created user)...");
  try {
    const registrationData = {
      userId: "STU_1022",
      name: "John Doe"
    };

    const { user, defaultPassword } =
      await userService.registerUser(registrationData);

    console.log("User registered successfully:", user);
    console.log("Default password issued:", defaultPassword);

    if (!user?.id) {
      throw new Error("Registered user did not return an ID");
    }

    /**
     * ==============================
     * Test User Login
     * ==============================
     */
    console.log("Testing User Login...");
    const loginResult = await userService.login(
      registrationData.userId,
      defaultPassword
    );

    console.log("User logged in successfully:", loginResult);

    if (!loginResult?.token) {
      throw new Error("Login did not return a token");
    }

    /**
     * ==============================
     * Test Password Change
     * ==============================
     */
    console.log("Testing Password Change...");
    const updatedUser = await userService.changePassword(
      registrationData.userId,
      defaultPassword,
      "newSecurePassword123"
    );

    console.log("Password updated successfully:", updatedUser);

    /**
     * ==============================
     * Test Login with Old Password (Should Fail)
     * ==============================
     */
    console.log("Testing login with old password (should fail)...");
    try {
      await userService.login(
        registrationData.userId,
        defaultPassword
      );
      console.error("❌ Old password login should have failed");
    } catch (error) {
      console.log("Old password correctly rejected:", error.message);
    }

    /**
     * ==============================
     * Test Login with New Password
     * ==============================
     */
    console.log("Testing login with new password...");
    const reloginResult = await userService.login(
      registrationData.userId,
      "newSecurePassword123"
    );

    console.log("Login with new password successful:", reloginResult);

  } catch (error) {
    console.error("Error in User Service test:", error.message);
  }
})();
