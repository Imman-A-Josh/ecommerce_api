const Product = require("../models/Product");
const Brand = require("../models/Brand");
const Category = require("../models/Category");

exports.createProduct = async (req, res) => {
    try {
        let { name, sku, description, price, brand_id, category_ids, quantity } = req.body;

        if (!name || !sku || !price || !brand_id || !category_ids) {
            return res.status(400).json({ message: "Missing mandatory fields" });
        }

        if (typeof category_ids == "string") {
            try {
                category_ids = JSON.parse(category_ids);
            } catch (e) {
                return res.status(400).json({ message: "Invalid category_ids format" });
            }
        }

        const brand = await Brand.findByPk(brand_id);
        if (!brand) return res.status(400).json({ message: "Brand not found" });

        const categories = await Category.findAll({ where: { id: category_ids } });
        if (categories.length !== category_ids.length) {
            return res.status(400).json({ message: "One or more categories not found" });
        }

        const product = await Product.create({
            name, sku, description, price, brand_id, quantity,
            image_url: req.file ? `/uploads/products/${req.file.filename}` : null
        });

        await product.setCategories(categories);

        res.status(200).json({ message: "Product Created Successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [
                { model: Brand, as: "brand" },
                { model: Category, as: "categories" }
            ],
            order: [["createdAt", "DESC"]]
        });
        res.json(products);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: ["brand", "categories"]
        });
        if (!product) return res.status(400).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
