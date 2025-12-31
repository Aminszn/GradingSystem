const isLoggedIn = require('../src/middlewares/isLoggedin');
const isStudent = require('../src/middlewares/isStudent');
const isAdmin = require('../src/middlewares/isAdmin');

const mockRes = {
  status: (code) => ({
    json: (data) => console.log(`Response ${code}:`, data)
  })
};

const next = () => console.log('Middleware passed\n');

(async () => {
  console.log('==============================');
  console.log('Testing isLoggedIn');
  console.log('==============================');

  await isLoggedIn(
    {
      headers: {
        authorization: 'Bearer fake.jwt.token'
      }
    },
    mockRes,
    next
  );

  console.log('==============================');
  console.log('Testing isStudent');
  console.log('==============================');

  await isStudent(
    {
      userAuth: {
        role: 'student'
      }
    },
    mockRes,
    next
  );

  console.log('==============================');
  console.log('Testing isAdmin');
  console.log('==============================');

  await isAdmin(
    {
      userAuth: {
        id: 'ADMIN_001' // must exist in your Excel admin table
      }
    },
    mockRes,
    next
  );
})();
