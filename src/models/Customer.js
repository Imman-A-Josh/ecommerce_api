const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Customer = sequelize.define("Customer", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    customer_code: { type: DataTypes.STRING(50), unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
}, {
    timestamps: true,
    tableName: "customers",
});

Customer.beforeCreate(async (customer) => {
    const lastCustomer = await Customer.findOne({
        order: [['id', 'DESC']]
    });
    let nextNumber = 1;
    if (lastCustomer && lastCustomer.customer_code) {
        nextNumber = parseInt(lastCustomer.customer_code.replace("CUS", "")) + 1;
    }
    customer.customer_code = "CUS" + String(nextNumber).padStart(3, "0");
});

module.exports = Customer;
