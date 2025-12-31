const SchoolBuilder = require("../../src/academics/models/school/schoolBuilder");
const ClassBuilder = require("../../src/academics/models/class/classBuilder");
const SubjectBuilder = require("../../src/academics/models/subject/subjectBuilder");
const ClassSubjectBuilder = require("../../src/academics/models/classSubject/classSubjectBuilder");
const TeacherAssignmentBuilder = require("../../src/academics/models/teacherAssignment/teacherAssignmentBuilder");

const SchoolService = require("../../src/academics/services/schoolService");
const ClassService = require("../../src/academics/services/ClassService");
const SubjectService = require("../../src/academics/services/subjectService");
const ClassSubjectService = require("../../src/academics/services/classSubjectService");
const TeacherAssignmentService = require("../../src/academics/services/teacherAssignmentService");

const schoolService = new SchoolService();
const classService = new ClassService();
const subjectService = new SubjectService();
const classSubjectService = new ClassSubjectService();
const teacherAssignmentService = new TeacherAssignmentService();

const EMPLOYEE_ID = "EMP001";

// Test School Model Creation
console.log("\nTesting School Builder...");
try {
  const school = new SchoolBuilder()
    .setName("Test School")
    .setCode("TSCH")
    .setAddress("123 Test St")
    .setPhone("1234567890")
    .setEmail("info@test.com")
    .setWebsite("https://www.test.com")
    .setCurrentAcademicYear("2024/2025")
    .setCurrentTerm("First Term")
    .build();
  console.log("School Builder Success:", school);
} catch (error) {
  console.error("School Builder Failed:", error.message);
}

// Test Class Model Creation
console.log("\nTesting Class Builder...");
try {
  const classEntity = new ClassBuilder()
    .setName("JSS1")
    .setLevel("junior")
    .build();
  console.log("Class Builder Success:", classEntity);
} catch (error) {
  console.error("Class Builder Failed:", error.message);
}

// Test Subject Model Creation
console.log("\nTesting Subject Builder...");
try {
  const subject = new SubjectBuilder()
    .setName("Mathematics")
    .setLevel("junior")
    .build();
  console.log("Subject Builder Success:", subject);
} catch (error) {
  console.error("Subject Builder Failed:", error.message);
}

// Test ClassSubject Model Creation
console.log("\nTesting ClassSubject Builder...");
try {
  const classSubject = new ClassSubjectBuilder()
    .setClassId("CLS001")
    .setSubjectId("SUB001")
    .setAcademicYear("2024/2025")
    .setAssignedAt(new Date())
    .build();
  console.log("ClassSubject Builder Success:", classSubject);
} catch (error) {
  console.error("ClassSubject Builder Failed:", error.message);
}

// Test TeacherAssignment Model Creation
console.log("\nTesting TeacherAssignment Builder...");
try {
  const teacherAssignment = new TeacherAssignmentBuilder()
    .setEmployeeId(EMPLOYEE_ID)
    .setSubjectId("SUB001")
    .setClassId("CLS001")
    .setAcademicYear("2024/2025")
    .setAssignedAt(new Date())
    .build();
  console.log("TeacherAssignment Builder Success:", teacherAssignment);
} catch (error) {
  console.error("TeacherAssignment Builder Failed:", error.message);
}

// Sequential async tests to ensure dependencies are resolved
(async () => {
  console.log("\nTesting School Service...");
  try {
    const schoolData = {
      name: "Test School",
      code: "TSCH",
      address: "123 Test St",
      phone: "1234567890",
      email: "info@test.com",
      website: "https://www.test.com",
      currentAcademicYear: "2024/2025",
      currentTerm: "First Term"
    };
    const createdSchool = await schoolService.createSchool(schoolData);
    console.log("School Created:", createdSchool);
    const fetchedSchool = await schoolService.getSchoolById(createdSchool.id);
    console.log("School Retrieved:", fetchedSchool);
  } catch (error) {
    console.error("School Service Failed:", error.message);
    return; // Exit early if school creation fails (though not dependent)
  }

  console.log("\nTesting Class Service...");
  try {
    const classData = {
      name: "JSS1",
      level: "junior"
    };
    const createdClass = await classService.createClass(classData);
    console.log("Class Created:", createdClass);
    global.CLASS_ID = createdClass.id;
    const fetchedClass = await classService.getClassById(createdClass.id);
    console.log("Class Retrieved:", fetchedClass);
  } catch (error) {
    console.error("Class Service Failed:", error.message);
    return; // Exit early if class creation fails
  }

  console.log("\nTesting Subject Service...");
  try {
    const subjectData = {
      name: "Mathematics",
      level: "junior"
    };
    const createdSubject = await subjectService.createSubject(subjectData);
    console.log("Subject Created:", createdSubject);
    global.SUBJECT_ID = createdSubject.id;
    const fetchedSubject = await subjectService.getSubjectById(createdSubject.id);
    console.log("Subject Retrieved:", fetchedSubject);
  } catch (error) {
    console.error("Subject Service Failed:", error.message);
    return; // Exit early if subject creation fails
  }

  console.log("\nTesting ClassSubject Service...");
  try {
    const classSubjectData = {
      classId: global.CLASS_ID,
      subjectId: global.SUBJECT_ID,
      academicYear: "2024/2025",
      assignedAt: new Date()
    };
    const createdClassSubject = await classSubjectService.createAssignment(classSubjectData);
    console.log("ClassSubject Created:", createdClassSubject);
    const fetchedClassSubject = await classSubjectService.getAssignmentById(createdClassSubject.id);
    console.log("ClassSubject Retrieved:", fetchedClassSubject);
  } catch (error) {
    console.error("ClassSubject Service Failed:", error.message);
    return; // Exit early if classSubject creation fails
  }

  console.log("\nTesting TeacherAssignment Service...");
  try {
    const teacherAssignmentData = {
      employeeId: EMPLOYEE_ID,
      subjectId: global.SUBJECT_ID,
      classId: global.CLASS_ID,
      academicYear: "2024/2025",
      assignedAt: new Date()
    };
    const createdTeacherAssignment = await teacherAssignmentService.createAssignment(teacherAssignmentData);
    console.log("TeacherAssignment Created:", createdTeacherAssignment);
    const fetchedTeacherAssignment = await teacherAssignmentService.getAssignmentById(createdTeacherAssignment.id);
    console.log("TeacherAssignment Retrieved:", fetchedTeacherAssignment);
  } catch (error) {
    console.error("TeacherAssignment Service Failed:", error.message);
  }
})();