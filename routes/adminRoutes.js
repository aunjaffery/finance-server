const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin.controller");

router.get("/superAdmin", adminController.superAdmin);
router.get("/getadmin", adminController.getAdmin);

module.exports = router;
