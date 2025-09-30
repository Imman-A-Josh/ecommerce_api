const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Category name is required" });

        const existing = await Category.findOne({ where: { name, created_by: req.user?.id } });
        if (existing) return res.status(400).json({ message: "Category already exists" });

        const category = await Category.create({
            name,
            created_by: req.user?.id || null,
        });

        res.status(200).json({ message: "Category Created Successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const created_by = req.user?.id;
        if (!created_by) return res.status(401).json({ message: "Unauthorized" });

        const categories = await Category.findAll({
            where: { created_by },
            order: [["createdAt", "DESC"]],
        });

        res.json(categories);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });
        res.json(category);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
