const Product = require("./Product");
const Store = require("./Store");

// Many-to-Many
Product.belongsToMany(Store, { through: "ProductStore", foreignKey: "product_id", otherKey: "store_id" });
Store.belongsToMany(Product, { through: "ProductStore", foreignKey: "store_id", otherKey: "product_id" });
