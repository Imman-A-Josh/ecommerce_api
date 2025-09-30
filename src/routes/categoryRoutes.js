const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.post("/", auth, categoryController.createCategory);
router.get("/", auth, categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

module.exports = router;
