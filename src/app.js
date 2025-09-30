const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const userRoutes = require("./routes/userRoutes");
const customerRoutes = require("./routes/customerRoutes");
const productRoutes = require("./routes/productRoutes");
const storeRoutes = require("./routes/storeRoutes");
const storeProductRoutes = require("./routes/storeProductRoutes");
const brandRoutes = require("./routes/brandRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

// Middlewares!
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(errorHandler);

// Routes
app.get("/", (req, res) => res.send("API Running"));

app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/store-products", storeProductRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/categories", categoryRoutes);

module.exports = app;
