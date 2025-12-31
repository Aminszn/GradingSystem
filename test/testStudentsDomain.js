const StudentBuilder = require('../src/students/models/studentBuilder');
const StudentService = require('../src/students/services/studentService');

const studentService = new StudentService();

// Test model creation
console.log("Testing Student Model Creation...");
try {
  const student = new StudentBuilder()
    .setFirstName("John")
    .setLastName("Doe")
    .setEmail("john.doe@example.com")
    .build();
  console.log("Student Model Created Successfully:", student);
} catch (error) {
  console.error("Error Creating Student Model:", error);
}

// Test schema validation (invalid data)
console.log('Testing schema validation (invalid data)');
try {
  new StudentBuilder()
    .setFirstName("") // Invalid: empty first name
    .setLastName("Doe")
    .setEmail("invalid-email") // Invalid email format
    .build();
} catch (error) {
  console.error("Schema Validation Error Caught Successfully:", error.message);
}

// Test service functionality
(async () => {
  console.log("Testing Student Service Functionality...");
try {
  const studentData = {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
  };
  const createdStudent = await studentService.createStudent(studentData);
  console.log("Student Created Successfully:", createdStudent);
  const id = createdStudent.id;

  console.log("Retrieving Student by ID...");
  const retrievedStudent = await studentService.getStudentById(id);
  console.log("Student Retrieved Successfully:", retrievedStudent);

  console.log("Updating Student...");
  const updatedStudent = await studentService.updateStudent(id, { lastName: "Doe" });
  console.log("Student Updated Successfully:", updatedStudent);

  console.log("Getting All Students...");
  const allStudents = await studentService.getAllStudents();
  console.log("All Students Retrieved Successfully:", allStudents);

  console.log("Deleting Student...");
  await studentService.deleteStudent(id);
  console.log("Student Deleted Successfully");
} catch (error) {
  console.error("Student service failed:", error);
}
})();


