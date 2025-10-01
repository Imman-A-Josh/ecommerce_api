const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Customer = require("./Customer");

const Order = sequelize.define("Order", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order_id: { type: DataTypes.STRING(50), unique: true }, // make unique
    total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "CREATED" }
}, {
    timestamps: true,
    tableName: "orders"
});

Order.beforeCreate(async (order) => {
    const lastOrder = await Order.findOne({
        order: [['id', 'DESC']]
    });

    let nextNumber = 1;
    if (lastOrder && lastOrder.order_id) {
        nextNumber = parseInt(lastOrder.order_id.replace("ORD", "")) + 1;
    }

    order.order_id = "ORD" + String(nextNumber).padStart(3, "0");
});

// Associations
Customer.hasMany(Order, { foreignKey: "customer_id", as: "orders" });
Order.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });

module.exports = Order;
