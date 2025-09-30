const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User"); // optional: track who created

const Brand = sequelize.define("Brand", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    brandId: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING, allowNull: false },
    created_by: { type: DataTypes.INTEGER, allowNull: true },
}, {
    timestamps: true,
    tableName: "brands",
});

Brand.beforeCreate(async (brand) => {
    const lastBrand = await Brand.findOne({ order: [["createdAt", "DESC"]] });
    let nextNumber = 1;
    if (lastBrand && lastBrand.brandId) {
        nextNumber = parseInt(lastBrand.brandId.replace("BRD", "")) + 1;
    }
    brand.brandId = `BRD${String(nextNumber).padStart(3, "0")}`;
});

module.exports = Brand;
