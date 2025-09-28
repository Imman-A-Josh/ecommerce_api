require("dotenv").config();
const app = require("./src/app");
const sequelize = require("./src/config/db");

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
    console.log("Database connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
