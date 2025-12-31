const ExcelService = require('../src/db/excelHelpers/service');
// const StudentBuilder = require("../src/builders/studentBuilder");
const StudentService = require('../src/students/services/studentService');
// const BaseModel = require('../src/models/basemodel');

class ServiceTester{
    constructor() {
    this.studentService = new StudentService();
    this.excelService = new ExcelService();
    }

  async testPath() {
  try {
  console.log('\n' + '='.repeat(50));
  console.log('📊 TESTING EXCEL HELPER');
  console.log('='.repeat(50));

  const path = this.excelService.getFilePath('students');
  const workbook = this.excelService.readWorkbook(path);

  console.log('File path works' + path);
  console.log('With workbook already created' + workbook);

      console.log('.................................');
    console.log('With workbook not created in db');
    const path2 = this.excelService.getFilePath('result');
    const workbook2 = this.excelService.readWorkbook(path2);

    console.log('File path works' + path2);
    console.log('With workbook just created' + workbook2);

  } catch (error) {
    console.error("🚨 Test failed:", error)
  }
  };

  async testReadnWrite() {
  try {
    
    const table = 'result';

    console.log('........................');
    console.log('Testing the write and read methods');

    const info = await this.excelService.readAll(table);

      console.log(`reader works fine cuz of ${info} is active`);


    const data1 = {
      id: 1,
      studentId: 'STU0838'
    }
    info.push(data1);

    const res = await this.excelService.writeAll(table,info);

      if (res) {
        console.log('the Writer () works well!');
    } else {
      console.log('The Writer () failed');
      }
  } catch (error) {
    console.error("🚨 Test failed:", error)
  }

  };

  async testCRUDOP() {
    try {
        console.log('\n' + '='.repeat(50));
      console.log('📊 TESTING EXCEL SERVICE CRUD OP');
      console.log('='.repeat(50));
      const table = 'TXT';

    // Clear table for clean testing
    console.log('\n🧹 Clearing test table...');
    //  await service.clearTable('TXT');


      // Test create with ID generation
      console.log('\n➕ Testing Create with Auto ID Generation:');
      const studentData1 = {
        firstName: 'Test',
        lastName: 'Student1',
        email: 'test1@school.com',
        studentNumber: 'TEST001',
        grade: '10'
      };
      const modelPrefix = 'STU';
      const created1 = await this.excelService.create(table, studentData1, modelPrefix );
      console.log('Created record 1:', created1);
    console.log('Generated ID:', created1?.id);
    console.log('Auto timestamps:', { createdAt: created1?.createdAt, updatedAt: created1?.updatedAt });

    // Test create second record to see sequential IDs
    console.log('\n➕ Testing Sequential ID Generation:');
    const studentData2 = {
      firstName: 'Test',
      lastName: 'Student2',
      email: 'test2@school.com',
      studentNumber: 'TEST002',
      grade: '11'
    };

    const created2 = await this.excelService.create(table, studentData2, modelPrefix);
    console.log('Created record 2:', created2);
    console.log('Sequential ID:', created2?.id);

    console.log('\n' + '='.repeat(50));

    // Test findById - this is how findById works
    console.log('\n🔍 Testing FindById (How FindById Works):');
    const foundRecord = await this.excelService.findById(table, created1.id);
    console.log(`Found record: ${foundRecord?.firstName} ${foundRecord?.lastName}`);

    // Test findByName
    console.log('\n🔍 Testing FindByName:');
    const foundByName = await this.excelService.findByName(table, 'Test');
    console.log(`Found ${foundByName.length} records matching "Test":`);
    foundByName.forEach(record => {
      console.log(`  - ${record.firstName} ${record.lastName}`);
    });

    // Test partial name search
    console.log('\n🔍 Testing Partial Name Search:');
    const foundPartial = await this.excelService.findByName(table, 'student1');
    console.log(`Found ${foundPartial.length} records matching "student1":`);
    foundPartial.forEach(record => {
      console.log(`  - ${record.firstName} ${record.lastName}`);
    });

    // Test update with auto timestamp
    console.log('\n✏️ Testing Update with Auto Timestamp:');
    const originalTime = created1.updatedAt;

    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

    const updateData = { grade: '12', address: '123 Updated St' };
    const updated = await this.excelService.update(table, created1.id, updateData);
    console.log('Original updatedAt:', originalTime);
    console.log('After update:', updated?.updatedAt);
    console.log('Timestamp changed:', originalTime !== updated?.updatedAt);
    console.log('Updated grade:', updated?.grade);
    console.log('Updated address:', updated?.address);

    // Test delete
    console.log('\n🗑️ Testing Delete:');
    const deleteResult = await this.excelService.delete(table, created2.id);
    console.log('Delete successful:', deleteResult);

    const recordsAfterDelete = await this.excelService.readAll(table);
    console.log(`Records after delete: ${recordsAfterDelete.length}`);
  } catch (error) {
    console.error("🚨 Test failed:", error)
  }
  };

  async runAllTests() {
  console.log('🚀 STARTING COMPREHENSIVE SYSTEM TESTS');
  console.log('=' + '='.repeat(60) + '=');


try {
  // await this.testBaseModel();
  // await new Promise(resolve => setTimeout(resolve, 200)); // Small delay for readability
  
  // await this.testStudentModel();
  // await new Promise(resolve => setTimeout(resolve, 200));
  
  // await this.testStudentBuilder();
  // await new Promise(resolve => setTimeout(resolve, 200));
  
  await this.testPath();
  await new Promise(resolve => setTimeout(resolve, 200));
  
  await this.testReadnWrite();
  await new Promise(resolve => setTimeout(resolve, 200));
  
  await this.testCRUDOP();
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // await this.testErrorHandling();
  // await new Promise(resolve => setTimeout(resolve, 200));
  
  // await this.demonstrateReadAllProcess();

  console.log('\n' + '='.repeat(62));
  console.log('✅ ALL TESTS COMPLETED SUCCESSFULLY!');
  console.log('='.repeat(62));
  
} catch (error) {
  console.error('\n💥 TEST FAILED:', error.message);
  console.error('Stack trace:', error.stack);
}

  }
}

// Create and run the tester
const tester = new ServiceTester();

// Run the tests
async function runTests() {
// await setupTestData();
await tester.runAllTests();
}

runTests().catch(console.error);




