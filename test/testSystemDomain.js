const AdminActionService = require("../src/system/services/adminActionService");
const AdminActionBuilder = require("../src/system/models/adminActionBuilder");

const actionService = new AdminActionService();

/**
 * ==============================
 * Test Admin Action Model Creation
 * ==============================
 */
console.log("Testing Admin Action Model Creation...");
try {
  const action = AdminActionBuilder.create()
    .setData({
      actorId: "ADMIN_001",
      action: "DELETE_STUDENT",
      entityType: "student",
      entityId: "STU_123",
    })
    .build();

  console.log("Admin Action Model Created Successfully:", action);
} catch (error) {
  console.error("Error creating Admin Action Model:", error.message);
}

/**
 * ==============================
 * Test Schema Validation (Invalid Data)
 * ==============================
 */
console.log("Testing schema validation (invalid data)...");
try {
  AdminActionBuilder.create()
    .setData({
      actorId: "",               // ❌ invalid
      // action missing           // ❌ required
      entityType: "student",
      entityId: "STU_123",
      timestamp: "not-a-date",   // ❌ invalid ISO date
    })
    .build();

  console.error("❌ Schema validation failed to catch errors.");
} catch (error) {
  console.log("Schema validation error caught successfully:", error.message);
}

/**
 * ==============================
 * Test Admin Action Service
 * ==============================
 */
(async () => {
  console.log("Testing Admin Action Service Functionality...");
  try {
    const actionData = {
      actorId: "ADMIN_001",
      action: "DELETE_STUDENT",
      entityType: "student",
      entityId: "STU_456",
      metadata: { reason: "disciplinary" },
    };

    const createdAction = await actionService.log(actionData);
    console.log("Admin Action logged successfully:", createdAction);

    if (!createdAction?.id) {
      throw new Error("Logged action did not return an ID");
    }

    console.log("Retrieving Admin Action by ID...");
    const retrievedAction = await actionService.getById(createdAction.id);
    console.log("Admin Action retrieved successfully:", retrievedAction);

    console.log("Getting All Admin Actions...");
    const allActions = await actionService.getAll();
    console.log("All Admin Actions retrieved successfully:", allActions);

  } catch (error) {
    console.error("Error in Admin Action Service test:", error.message);
  }
})();
