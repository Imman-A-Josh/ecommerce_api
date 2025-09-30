const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Store = sequelize.define("Store", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    storeId: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false },
    contact: { type: DataTypes.STRING },
    address_line: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    state: { type: DataTypes.STRING, allowNull: false },
    country: { type: DataTypes.STRING, allowNull: false },
    latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: false },
    longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: false },
}, {
    timestamps: true,
    tableName: "stores",
});

Store.beforeCreate(async (store) => {
    const lastStore = await Store.findOne({
        order: [["createdAt", "DESC"]],
    });

    let nextNumber = 1;
    if (lastStore && lastStore.storeId) {
        nextNumber = parseInt(lastStore.storeId.replace("STR", "")) + 1;
    }

    store.storeId = `STR${String(nextNumber).padStart(3, "0")}`;
});

module.exports = Store;
