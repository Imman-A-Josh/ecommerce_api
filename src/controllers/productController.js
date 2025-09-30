const Product = require("../models/Product");

// Create product
exports.createProduct = async (req, res) => {
    try {
        const { name, sku, description, price, status } = req.body;

        if (!name || !sku || !price) {
            return res.status(400).json({ message: "Name, SKU, and Price are required" });
        }

        const exist = await Product.findOne({ where: { sku } });
        if (exist) return res.status(400).json({ message: "SKU already exists" });

        const product = await Product.create({
            name,
            sku,
            description,
            price,
            status,
            image_url: req.file ? `/uploads/products/${req.file.filename}` : null
        });

        res.status(200).json({ message: "Product created", product });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            order: [["createdAt", "DESC"]],
        });
        res.json(products);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};


exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};
