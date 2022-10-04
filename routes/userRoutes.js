const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const clientController = require("../controller/client.controller");
const {
  getTransactions,
  createTransaction,
  markTransaction,
  deleteTransaction,
  getTransactionDetails,
  pieTransaction,
} = require("../controller/transaction.controller");
const validateRequest = require("../middleware/validateRequest");
const {
  loginUserSchema,
  createUserSchema,
  changeUserNameSchema,
  changePassSchema,
} = require("../schema/user.schema");
const { createClientSchema } = require("../schema/client.schema");
const {
  createTransactionSchema,
  markTransactionSchema,
  transactionDetailSchema,
} = require("../schema/transaction.schema");
const authPolicy = require("../utils/auth.policy");

router.post(
  "/signup",
  validateRequest(createUserSchema),
  userController.signUpUser
);
router.post(
  "/login",
  validateRequest(loginUserSchema),
  userController.loginUser
);
router.get("/validation", authPolicy, userController.validation);
router.post(
  "/changeName",
  authPolicy,
  validateRequest(changeUserNameSchema),
  userController.changeName
);
router.post(
  "/changePass",
  authPolicy,
  validateRequest(changePassSchema),
  userController.changePass
);

//client routes
router.post(
  "/createClient",
  authPolicy,
  validateRequest(createClientSchema),
  clientController.createClient
);
router.get("/getUserClients", authPolicy, clientController.getUserClients);
router.delete("/deleteClient/:id", authPolicy, clientController.deleteClient);

//transaction routes
router.post("/getTransactions", authPolicy, getTransactions);
router.get("/pieTransaction", authPolicy, pieTransaction);
router.get(
  "/getTransactionDetails",
  authPolicy,
  validateRequest(transactionDetailSchema),
  getTransactionDetails
);
router.post(
  "/createTransaction",
  authPolicy,
  validateRequest(createTransactionSchema),
  createTransaction
);
router.post(
  "/markTransaction",
  authPolicy,
  validateRequest(markTransactionSchema),
  markTransaction
);
router.delete("/deleteTransaction/:id", authPolicy, deleteTransaction);

module.exports = router;
