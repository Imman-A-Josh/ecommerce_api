const express = require("express");
const Store = require("../models/Store");
const router = express.Router();
const { getNearbyStores } = require("../controllers/storeController");

// Create store
router.post("/", async (req, res) => {
    try {
        const { name, code, address_line, city, state, country, latitude, longitude } = req.body;

        if (!name || !code || !address_line || !city || !state || !country || !latitude || !longitude) {
            return res.status(400).json({ message: "Missing Mandatory Fields" });
        }

        const store = await Store.create(req.body);
        res.status(200).json({ message: "Store Created Successfully" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});


// Get all stores
router.get("/", async (req, res) => {
  try {
    const stores = await Store.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(stores);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});


// Get store by id
router.get("/:id", async (req, res) => {
    try {
        const store = await Store.findByPk(req.params.id);
        if (!store) return res.status(404).json({ message: "Store not found" });
        res.json(store);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

router.post("/nearby", getNearbyStores);

module.exports = router;
