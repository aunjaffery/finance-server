const express = require("express");
const router = express.Router();
const adminRoutes = require("./adminRoutes");
const userRoutes = require("./userRoutes");

router.use("/admin", adminRoutes);
router.use("/user", userRoutes);

//Health check route
router.get("/check", (req, res) => {
  console.log("Check health Called");
  return res.status(200).json({ success: true, msg: "App is healthy" });
});

module.exports = router;
