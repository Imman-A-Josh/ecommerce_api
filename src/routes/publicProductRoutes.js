const express = require("express");
const router = express.Router();
const publicProductController = require("../controllers/publicProductController");

router.get("/", publicProductController.getPublicProducts);

router.get("/:category_id", publicProductController.getProductsByCategory);

module.exports = router;
