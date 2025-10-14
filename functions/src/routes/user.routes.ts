import express from "express";

const router = express.Router();

// Health check endpoint for user routes
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "User routes are working!",
    timestamp: new Date().toISOString(),
  });
});

// Temporary signup endpoint for testing
router.post("/signup", (req, res) => {
  const {fullName, email, password, contact} = req.body;

  // Basic validation
  if (!fullName || !email || !password || !contact) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  return res.json({
    success: true,
    message: "Signup endpoint working - ready for full implementation",
    data: {fullName, email, contact},
  });
});

export default router;
