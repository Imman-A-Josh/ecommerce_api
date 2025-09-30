const Product = require("../models/Product");
const Store = require("../models/Store");
const Index = require("../models/Associations");

exports.addProductToStore = async (req, res, next) => {
    try {
        const { productId, storeId } = req.body;

        const product = await Product.findByPk(productId);
        const store = await Store.findByPk(storeId);

        if (!product || !store) return res.status(400).json({ message: "Product or Store not found" });

        await store.addProduct(product);
        res.json({ message: "Product added to store" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

exports.removeProductFromStore = async (req, res, next) => {
    try {
        const { productId, storeId } = req.body;

        const product = await Product.findByPk(productId);
        const store = await Store.findByPk(storeId);
        if (!product || !store) return res.status(400).json({ message: "Product or Store not found" });

        await store.removeProduct(product);
        res.json({ message: "Product removed from store" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};
