const express = require("express");
const { createBrand, getAllBrands, getBrandById } = require("../controllers/brandController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, createBrand);
router.get("/", auth,getAllBrands);
router.get("/:id", getBrandById);

module.exports = router;
