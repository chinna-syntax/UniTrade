// DEMO MODE: Bypass admin authentication - hardcoded admin user for every request
const DUMMY_ADMIN = {
  userId: "123",
  userEmail: "senior@college.edu",
  name: "Senior Student",
  isAdmin: true,
};

const adminAuth = async (req, res, next) => {
  req.user = DUMMY_ADMIN;
  next();
};

module.exports = adminAuth;
