const express = require("express");
const router = express.Router();
const controller = require("../controllers/storeProductController");
const auth = require("../middleware/auth");

router.post("/add", auth, controller.addProductToStore);
router.post("/remove", auth, controller.removeProductFromStore);

module.exports = router;
