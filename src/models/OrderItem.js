// models/OrderItem.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Order = require("./Order");
const Product = require("./Product");

const OrderItem = sequelize.define("OrderItem", {
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price_snapshot: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, {
    timestamps: true,
    tableName: "order_items"
});

Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "order_id", as: "order" });

Product.hasMany(OrderItem, { foreignKey: "product_id", as: "order_items" });
OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

module.exports = OrderItem;
