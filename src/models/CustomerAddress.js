const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Customer = require("./Customer");

const CustomerAddress = sequelize.define("CustomerAddress", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    customer_id: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Customer,
            key: "id"
        },
    },
    address_line: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Default Address"
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false
    },
}, {
    timestamps: true,
    tableName: "customer_addresses",
});

// Associations
Customer.hasMany(CustomerAddress, { foreignKey: "customer_id", as: "addresses" });
CustomerAddress.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });

module.exports = CustomerAddress;
