// DEMO MODE: Bypass all authentication - hardcoded dummy user for every request
const DUMMY_USER = {
  userId: "123",
  userEmail: "senior@college.edu",
  name: "Senior Student",
};

module.exports = async (request, response, next) => {
  // Simply inject the dummy user and pass through - no token checks
  request.user = DUMMY_USER;
  next();
};