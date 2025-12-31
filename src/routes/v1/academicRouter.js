const express = require("express");
const academicRouter = express.Router();

/* =========================
   Middlewares
   ========================= */
const isLoggedIn = require("../../middlewares/isLoggedin");
const {authorizeRole, authorizePosition} = require("../../middlewares/authorize");

/* =========================
   Controllers 
   ========================= */

// Class
const {
  createClass,
  getAllClasses,
  getClassById,
  findClassByName,
  findClassesByLevel,
  updateClass,
  deleteClass,
} = require("../../academics/controllers/classController");

// Class–Subject
const {
  createAssignment: createClassSubject,
  getAllAssignments: getAllClassSubjects,
  getAssignmentById: getClassSubjectById,
  findAssignmentsByClassId,
  findAssignmentsByAcademicYear,
  updateAssignment: updateClassSubject,
  deleteAssignment: deleteClassSubject,
} = require("../../academics/controllers/classSubjectController");

// Enrollment
const {
  enrollStudent,
  getAllEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
  getEnrollmentsByStudentId,
  getEnrollmentsByClassId,
  getEnrollmentByStudentAndYear,
} = require("../../academics/controllers/enrollmentController");

// Exam
const {
  createExam,
  getAllExams,
  getExamById,
  findExamsByClassId,
  findExamsBySubjectId,
  findExamsByStatus,
  updateExam,
  deleteExam,
  startExam,
  submitExam,
} = require("../../academics/controllers/examController");

// Exam Questions
const {
  createQuestion,
  createQuestionsForExam,
  getAllQuestions,
  getQuestionById,
  getQuestionsByExamId,
  updateQuestion,
  deleteQuestion,
} = require("../../academics/controllers/examQuestionController");

// Student Answer
const {saveAnswer,} = require("../../academics/controllers/studentAnswerController");

// Results
const {
  getAllResults,
  getResultById,
  getResultsByStudentId,
  getResultsByExamId,
  generateResult,
} = require("../../academics/controllers/resultController");

// School
const {
  createSchool,
  getAllSchools,
  getSchoolById,
  updateSchool,
  deleteSchool,
} = require("../../academics/controllers/schoolController");

// Subject
const {
  createSubject,
  getAllSubjects,
  getSubjectById,
  findSubjectsByLevel,
  updateSubject,
  deleteSubject,
} = require("../../academics/controllers/subjectController");

// Teacher Assignment
const {
  createAssignment: createTeacherAssignment,
  getAllAssignments: getAllTeacherAssignments,
  getAssignmentById: getTeacherAssignmentById,
  updateAssignment: updateTeacherAssignment,
  deleteAssignment: deleteTeacherAssignment,
  getAssignmentsByEmployeeId,
  getAssignmentsByClassId: getTeacherAssignmentsByClassId,
  getAssignmentsBySubjectId: getTeacherAssignmentsBySubjectId,
} = require("../../academics/controllers/teacherAssignmentController");

// Admission routes
const {
  admitStudent,
  getAllAdmissions,
  getAdmissionById,
  getAdmissionByEmail,
} = require("../../academics/controllers/admissionController");


/* =========================================================
   CLASS ROUTES
   ========================================================= */

academicRouter.post("/classes", isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Vice Principal", "Receptionist"]), createClass);
academicRouter.get("/classes", isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Vice Principal", "Receptionist"]), getAllClasses);
academicRouter.get("/classes/:id", isLoggedIn, authorizeRole(["admin", "staff"]), getClassById);
academicRouter.get("/classes/name/:name", isLoggedIn, authorizeRole(["admin", "staff"]), findClassByName);
academicRouter.get("/classes/level/:level", isLoggedIn, authorizeRole(["admin", "staff"]), findClassesByLevel);
academicRouter.patch("/classes/:id", isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Vice Principal", "Receptionist"]), updateClass);
academicRouter.delete("/classes/:id", isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Vice Principal", "Receptionist"]), deleteClass);



/* =========================================================
   CLASS–SUBJECT ROUTES
   ========================================================= */

academicRouter.post("/class-subjects", isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Vice Principal", "Receptionist"]), createClassSubject);
academicRouter.get("/class-subjects", isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Vice Principal", "Receptionist"]), getAllClassSubjects);
academicRouter.get("/class-subjects/:id", isLoggedIn, authorizeRole(["admin", "staff"]), getClassSubjectById);
academicRouter.get("/class-subjects/class/:classId", isLoggedIn, authorizeRole(["admin", "staff"]), findAssignmentsByClassId);
academicRouter.get("/class-subjects/year/:academicYear", isLoggedIn, authorizeRole(["admin", "staff"]), findAssignmentsByAcademicYear);
academicRouter.patch("/class-subjects/:id", isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Vice Principal", "Receptionist"]), updateClassSubject);
academicRouter.delete("/class-subjects/:id", isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Vice Principal", "Receptionist"]), deleteClassSubject);



/* =========================================================
   ENROLLMENT ROUTES
   ========================================================= */

academicRouter.post("/enrollments/enroll", isLoggedIn, authorizeRole(["admin", "staff"]),authorizePosition(["Principal", "Receptionist"]), enrollStudent);
academicRouter.get("/enrollments", isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Vice Principal", "Receptionist"]), getAllEnrollments);
academicRouter.get("/enrollments/:id", isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Vice Principal", "Receptionist", "Teacher"]), getEnrollmentById);
academicRouter.get("/enrollments/student/:studentId", isLoggedIn, getEnrollmentsByStudentId);
academicRouter.get("/enrollments/class/:classId", isLoggedIn, authorizeRole(["admin", "staff"]), getEnrollmentsByClassId);
academicRouter.get(
  "/enrollments/student/:studentId/year/:academicYear",
  isLoggedIn,
  authorizeRole(["admin", "staff"]),
  getEnrollmentByStudentAndYear
);
academicRouter.patch("/enrollments/:id", isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Receptionist"]), updateEnrollment);
academicRouter.delete("/enrollments/:id", isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Receptionist"]), deleteEnrollment);



/* =========================================================
   EXAM ROUTES
   ========================================================= */

academicRouter.post("/exams", isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Vice Principal", "Teacher"]), createExam);
academicRouter.get("/exams", isLoggedIn, authorizeRole(["admin", "staff"]), getAllExams);
academicRouter.get("/exams/:id", isLoggedIn, authorizeRole(["admin", "staff", "student"]), getExamById);
academicRouter.get("/exams/class/:classId", isLoggedIn, authorizeRole(["admin", "staff", "student"]), findExamsByClassId);
academicRouter.get("/exams/subject/:subjectId", isLoggedIn, authorizeRole(["admin", "staff", "student"]), findExamsBySubjectId);
academicRouter.get("/exams/status/:status", isLoggedIn, authorizeRole(["admin", "staff"]), findExamsByStatus);
academicRouter.patch("/exams/:id", isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Vice Principal", "Receptionist", "Teacher"]), updateExam);
academicRouter.delete("/exams/:id", isLoggedIn, authorizeRole(["admin"]), authorizePosition(["Principal", "Vice Principal"]), deleteExam);

/* student actions */
academicRouter.post("/exams/:examId/start", isLoggedIn, authorizeRole(["student"]), startExam);
academicRouter.post("/exams/:examId/submit", isLoggedIn, authorizeRole(["student"]), submitExam);
academicRouter.post("/exams/:examId/answers", isLoggedIn, authorizeRole(["student"]), saveAnswer);



/* =========================================================
   EXAM QUESTION ROUTES
   ========================================================= */

academicRouter.post("/exam-questions", isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Teacher"]), createQuestion);
academicRouter.post(
  "/exam-questions/exam/:examId/bulk",
  isLoggedIn,
  authorizeRole(["admin", "staff"]),
  authorizePosition(["Teacher"]),
  createQuestionsForExam
);
academicRouter.get("/exam-questions", isLoggedIn, getAllQuestions);
academicRouter.get("/exam-questions/:id", isLoggedIn, getQuestionById);
academicRouter.get("/exam-questions/exam/:examId", isLoggedIn, getQuestionsByExamId);
academicRouter.patch("/exam-questions/:id", isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Vice Principal", "Teacher"]), updateQuestion);
academicRouter.delete("/exam-questions/:id", isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Vice Principal", "Teacher"]), deleteQuestion);



/* =========================================================
   RESULT ROUTES
   ========================================================= */

academicRouter.get("/results", isLoggedIn, authorizeRole(["admin"]), getAllResults);
academicRouter.get("/results/:id", isLoggedIn, authorizeRole(["admin", "staff"]), getResultById);
academicRouter.get("/results/student/:studentId", isLoggedIn, getResultsByStudentId);
academicRouter.get("/results/exam/:examId", isLoggedIn, authorizeRole(["admin", "staff"]), getResultsByExamId);

/* Business action */
academicRouter.post("/results/generate", isLoggedIn, authorizeRole(["admin"]), generateResult);



/* =========================================================
   SCHOOL ROUTES
   ========================================================= */

academicRouter.post("/schools", isLoggedIn, authorizeRole(["admin"]), createSchool);
academicRouter.get("/schools", isLoggedIn, authorizeRole(["admin"]), getAllSchools);
academicRouter.get("/schools/:id", isLoggedIn, authorizeRole(["admin"]), getSchoolById);
academicRouter.patch("/schools/:id", isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Vice Principal", "Receptionist"]), updateSchool);
academicRouter.delete("/schools/:id", isLoggedIn, authorizeRole(["admin"]), deleteSchool);



/* =========================================================
   SUBJECT ROUTES
   ========================================================= */

academicRouter.post("/subjects", isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Vice Principal", "Receptionist"]), createSubject);
academicRouter.get("/subjects", isLoggedIn, getAllSubjects);
academicRouter.get("/subjects/:id", isLoggedIn, getSubjectById);
academicRouter.get("/subjects/level/:level", isLoggedIn, findSubjectsByLevel);
academicRouter.patch("/subjects/:id", isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Vice Principal", "Receptionist"]), updateSubject);
academicRouter.delete("/subjects/:id", isLoggedIn, authorizeRole(["admin"]), deleteSubject);



/* =========================================================
   TEACHER ASSIGNMENT ROUTES
   ========================================================= */

academicRouter.post("/teacher-assignments", isLoggedIn, authorizeRole(["admin", "staff"]), createTeacherAssignment);
academicRouter.get("/teacher-assignments", isLoggedIn, authorizeRole(["admin", "staff"]), getAllTeacherAssignments);
academicRouter.get("/teacher-assignments/:id", isLoggedIn, authorizeRole(["admin", "staff"]), getTeacherAssignmentById);
academicRouter.get("/teacher-assignments/employee/:employeeId", isLoggedIn, authorizeRole(["admin", "staff"]), getAssignmentsByEmployeeId);
academicRouter.get("/teacher-assignments/class/:classId", isLoggedIn, authorizeRole(["admin", "staff"]), getTeacherAssignmentsByClassId);
academicRouter.get("/teacher-assignments/subject/:subjectId", isLoggedIn, authorizeRole(["admin", "staff"]), getTeacherAssignmentsBySubjectId);
academicRouter.patch("/teacher-assignments/:id", isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Vice Principal", "Receptionist"]), updateTeacherAssignment);
academicRouter.delete("/teacher-assignments/:id", isLoggedIn, authorizeRole(["admin", "staff"]), deleteTeacherAssignment);

/* =========================
   Admission (Domain Entry)
   ========================= */

// Admit student
academicRouter.post(
  "/admissions",
  isLoggedIn,
  authorizeRole(["admin", "staff"]),
  authorizePosition(["Principal", "Vice Principal", "Receptionist"]),
  admitStudent
);

// Read all admissions
academicRouter.get(
  "/admissions",
  isLoggedIn,
  authorizeRole(["admin", "staff"]),
  getAllAdmissions
);

// Read admission by ID
academicRouter.get(
  "/admissions/:id",
  isLoggedIn,
  authorizeRole(["admin", "staff"]),
  getAdmissionById
);

// Read admission by email
academicRouter.get(
  "/admissions/email/:email",
  isLoggedIn,
  authorizeRole(["admin", "staff"]),
  getAdmissionByEmail
);


module.exports = academicRouter;
