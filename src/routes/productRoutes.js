const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/", auth, upload.single("image"), productController.createProduct);

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

module.exports = router;
