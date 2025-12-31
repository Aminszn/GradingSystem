const StaffBuilder = require("../src/staffs/models/staffBuilder");
const StaffService = require("../src/staffs/services/staffService");

const staffService = new StaffService();

/* =========================
   Test model creation
   ========================= */
console.log("Testing Staff Model Creation...");
try {
  const staff = new StaffBuilder()
    .setFirstName("Alice")
    .setLastName("Johnson")
    .setEmployeeId("EMP-TEST-001")
    .setStaffType("TEACHING") // MUST be uppercase
    .setHireDate(new Date().toISOString()) // REQUIRED
    .setPosition("Mathematics Teacher")
    .setRole("TEACHER") // REQUIRED & uppercase
    .setEmail("alice.johnson@example.com")
    .setPhoneNumber("08012345678")
    .setAddress("Main Campus")
    .build();

  console.log("Staff Model Created Successfully:", staff);
} catch (error) {
  console.error("Error Creating Staff Model:", error.message);
}

/* =========================
   Test schema validation (invalid data)
   ========================= */
console.log("Testing schema validation (invalid data)...");
try {
  new StaffBuilder()
    .setFirstName("") // Invalid
    .setLastName("Johnson")
    .setEmployeeId("EMP-FAIL")
    .setStaffType("TEACHING")
    .setHireDate(new Date().toISOString())
    .setPosition("Teacher")
    .setRole("TEACHER")
    .build();
} catch (error) {
  console.log(
    "Schema Validation Error Caught Successfully:",
    error.message
  );
}

/* =========================
   Test service functionality
   ========================= */
(async () => {
  console.log("Testing Staff Service Functionality...");
  try {
    const staffData = {
      firstName: "Michael",
      lastName: "Brown",
      employeeId: "EMP-TEST-002",
      staffType: "NON_TEACHING", // UPPERCASE
      hireDate: new Date().toISOString(), // REQUIRED
      position: "Administrative Officer",
      role: "RECEPTIONIST", // REQUIRED
      email: "michael.brown@example.com",
      phoneNumber: "08098765432",
      address: "Admin Block",
    };

    console.log("Creating Staff...");
    const createdStaff = await staffService.createStaff(staffData);
    console.log("Staff Created Successfully:", createdStaff);

    const id = createdStaff.id;

    console.log("Retrieving Staff by ID...");
    const retrievedStaff = await staffService.getStaffById(id);
    console.log("Staff Retrieved Successfully:", retrievedStaff);

    console.log("Updating Staff...");
    const updatedStaff = await staffService.updateStaff(id, {
      lastName: "Williams",
    });
    console.log("Staff Updated Successfully:", updatedStaff);

    console.log("Getting All Staff...");
    const allStaff = await staffService.getAllStaff();
    console.log("All Staff Retrieved Successfully:", allStaff);

    console.log("Deleting Staff...");
    await staffService.deleteStaff(id);
    console.log("Staff Deleted Successfully");
  } catch (error) {
    console.error("Staff service failed:", error.message);
  }
})();
