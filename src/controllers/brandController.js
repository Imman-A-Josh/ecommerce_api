const Brand = require("../models/Brand");

exports.createBrand = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Brand name is required" });

        const existing = await Brand.findOne({ where: { name, created_by: req.user?.id } });
        if (existing) return res.status(400).json({ message: "Brand already exists" });

        const brand = await Brand.create({
            name,
            created_by: req.user?.id || null,
        });

        res.status(200).json({ message: "Brand Created Successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAllBrands = async (req, res) => {
    try {
        const created_by = req.user?.id;

        console.log(req.user);
        
        if (!created_by) return res.status(401).json({ message: "Unauthorized" });

        const brands = await Brand.findAll({
            where: { created_by },
            order: [["createdAt", "DESC"]]
        });

        res.json(brands);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getBrandById = async (req, res) => {
    try {
        const brand = await Brand.findByPk(req.params.id);
        if (!brand) return res.status(404).json({ message: "Brand not found" });
        res.json(brand);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
