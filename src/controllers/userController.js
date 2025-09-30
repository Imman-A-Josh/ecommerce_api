const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Missing Mandatory Fields" });
        }

        const exist = await User.findOne({ where: { email } });

        if (exist) return res.status(400).json({ message: "Email already registered" });

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashed });

        res.status(200).json({ message: "User registered", user: { id: user.id, name, email } });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// Login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Missing Mandatory Fields" });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: "Invalid Email Details" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid email or password" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ message: "Login successful", token });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

exports.getUsers = async (req, res, next) => {
    try {

        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const { rows, count } = await User.findAndCountAll({ attributes: ["id", "name", "email"], limit, offset, order: [["createdAt", "DESC"]], });

        res.json({ users: rows, pagination: { total: count, page, totalPages: Math.ceil(count / limit), }, });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};
