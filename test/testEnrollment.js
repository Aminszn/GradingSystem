const EnrollmentBuilder = require('../src/academics/models/enrollment/enrollmentBuilder');
const EnrollmentService = require('../src/academics/services/enrollmentService');

const enrollmentService = new EnrollmentService();

// Test model creation
console.log("Testing Enrollment Model Creation...");
try {
  const enrollment = new EnrollmentBuilder()
    .setStudentId("STD001")
    .setClassId("CLS001")
    .setAcademicYear("2024/2025")
    .setEnrolledAt(new Date())
    .build();
  console.log("Enrollment Model Created Successfully:", enrollment);
} catch (error) {
  console.error("Error Creating Enrollment Model:", error);
}

// Test schema validation (invalid data)
console.log('Testing schema validation (invalid data)');
try {
  new EnrollmentBuilder()
    .setStudentId("") // Invalid: empty studentId
    .setClassId("CLS001")
    .setAcademicYear("2024/2025")
    .build();
} catch (error) {
  console.error("Schema Validation Error Caught Successfully:", error.message);
}

// Test service functionality
(async () => {
  console.log("Testing Enrollment Service Functionality...");
  try {
    const enrollmentData = {
      studentId: "STD001",
      classId: "CLS001",
      academicYear: "2024/2025",
      enrolledAt: new Date()
    };
    const createdEnrollment = await enrollmentService.createEnrollment(enrollmentData);
    console.log("Enrollment Created Successfully:", createdEnrollment);
    const id = createdEnrollment.id;

    console.log("Retrieving Enrollment by ID...");
    const retrievedEnrollment = await enrollmentService.getEnrollmentById(id);
    console.log("Enrollment Retrieved Successfully:", retrievedEnrollment);

    console.log("Updating Enrollment...");
    const updatedEnrollment = await enrollmentService.updateEnrollment(id, { academicYear: "2025/2026" });
    console.log("Enrollment Updated Successfully:", updatedEnrollment);

    console.log("Getting All Enrollments...");
    const allEnrollments = await enrollmentService.getAllEnrollments();
    console.log("All Enrollments Retrieved Successfully:", allEnrollments);

    console.log("Deleting Enrollment...");
    await enrollmentService.deleteEnrollment(id);
    console.log("Enrollment Deleted Successfully");
  } catch (error) {
    console.error("Enrollment service failed:", error);
  }
})();