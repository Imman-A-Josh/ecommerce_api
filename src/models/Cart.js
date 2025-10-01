const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Customer = require("./Customer");
const Product = require("./Product");

const Cart = sequelize.define("Cart", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    price_snapshot: { type: DataTypes.DECIMAL(10, 2), allowNull: false }, // price at add time
}, {
    timestamps: true,
    tableName: "carts",
});

Customer.hasMany(Cart, { foreignKey: "customer_id", as: "cart_items" });
Cart.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });

Product.hasMany(Cart, { foreignKey: "product_id", as: "cart_items" });
Cart.belongsTo(Product, { foreignKey: "product_id", as: "product" });

module.exports = Cart;
