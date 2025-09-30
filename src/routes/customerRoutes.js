const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const auth = require("../middleware/auth");

router.post("/register", customerController.register);
router.post("/login", customerController.login);
router.get("/profile", auth, customerController.profile);
router.put("/address", auth, customerController.updateAddress);

module.exports = router;
