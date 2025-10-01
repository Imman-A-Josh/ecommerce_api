const Product = require("../models/Product");
const Brand = require("../models/Brand");
const Category = require("../models/Category");

exports.getPublicProducts = async (req, res) => {
    try {
        const { brand_id, category_id, min_price, max_price, status } = req.query;

        let where = { status: status || "active" };
        if (min_price) where.price = { ...where.price, $gte: parseFloat(min_price) };
        if (max_price) where.price = { ...where.price, $lte: parseFloat(max_price) };
        if (brand_id) where.brand_id = brand_id;

        let include = [
            { model: Brand, as: "brand" }
        ];

        if (category_id) {
            include.push({
                model: Category,
                as: "categories",
                where: { id: category_id }
            });
        } else {
            include.push({ model: Category, as: "categories" });
        }

        const products = await Product.findAll({
            where,
            include,
            order: [["createdAt", "DESC"]]
        });

        res.json(products);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.category_id;
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const { count, rows: products } = await Product.findAndCountAll({
            include: [
                {
                    model: Category,
                    as: "categories",
                    where: { id: categoryId }
                },
                {
                    model: Brand,
                    as: "brand"
                }
            ],
            limit,
            offset,
            order: [["createdAt", "DESC"]]
        });

        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            page,
            limit,
            products
        });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
