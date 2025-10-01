const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Brand = require("./Brand");
const Category = require("./Category");

const Product = sequelize.define("Product", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  productId: { type: DataTypes.STRING }, // PRO001
  name: { type: DataTypes.STRING, allowNull: false },
  sku: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue:1 },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.ENUM("active", "inactive"), defaultValue: "active" },
  image_url: { type: DataTypes.STRING },
}, {
  timestamps: true,
  tableName: "products",
});

Brand.hasMany(Product, { foreignKey: "brand_id", as: "products" });
Product.belongsTo(Brand, { foreignKey: "brand_id", as: "brand" });

Product.belongsToMany(Category, { through: "ProductCategories", as: "categories", foreignKey: "product_id" });
Category.belongsToMany(Product, { through: "ProductCategories", as: "products", foreignKey: "category_id" });


Product.beforeCreate(async (product) => {
  const lastProduct = await Product.findOne({
    order: [["createdAt", "DESC"]],
  });

  let nextNumber = 1;
  if (lastProduct && lastProduct.productId) {
    nextNumber = parseInt(lastProduct.productId.replace("PRO", "")) + 1;
  }

  product.productId = `PRO${String(nextNumber).padStart(3, "0")}`;
});

module.exports = Product;
