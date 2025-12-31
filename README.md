# Grading System (Excel-Based School Portal)

An Excel-backed school grading and academic management system built with Node.js.
This project simulates core school operations such as student enrollment, exams,
grading, staff management, and academic records using Excel files as the data store.

---

## Features

- Student admission and enrollment
- Class and subject management
- Exam creation and question handling
- Student exam attempts and grading
- Result computation and storage
- Staff and teacher assignment management
- Role-based authorization middleware
- Excel-based persistence layer

---

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Excel (`.xlsx`) files
- **Validation:** Joi
- **Authentication:** JWT
- **Testing:** Console based tests
- **Architecture:** Controller–Service–Model (Layered)

---

## 📁 Project Structure
```
GradingSystem/
│
├── src/
│   ├── academics/        # Academic domain (students, exams, results, classes)
│   ├── staffs/           # Staff domain
│   ├── students/         # Student domain
│   ├── users/            # User & authentication domain
│   ├── system/           # Admin/system actions
│   ├── db/
│   │   ├── data/         # Excel data files
│   │   └── excelHelpers/ # Excel read/write helpers
│   ├── middlewares/      # Authorization & guards
│   ├── handlers/         # Utility handlers
│   ├── routes/           # API route definitions
│   └── utils/            # Utility functions
│
├── test/                 # Automated tests
├── index.js              # Application entry point
├── package.json
└── README.md

```