const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const CustomerAddress = require("../models/CustomerAddress");

// Register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, latitude, longitude } = req.body;

        if (!name || !email || !password || !latitude || !longitude) {
            return res.status(400).json({ message: "Missing Mandatory Fields" });
        }

        const exist = await Customer.findOne({ where: { email } });
        if (exist) return res.status(400).json({ message: "Email already exists" });

        const hashed = await bcrypt.hash(password, 10);

        const customer = await Customer.create({ name, email, password: hashed });

        await CustomerAddress.create({
            customer_id: customer.id,
            latitude: latitude || 0.0,
            longitude: longitude || 0.0,
        });

        res.status(200).json({ message: "Customer registered" });
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

        const customer = await Customer.findOne({ where: { email } });

        if (!customer) return res.status(400).json({ message: "Invalid email Details" });

        const match = await bcrypt.compare(password, customer.password);
        if (!match) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ id: customer.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ message: "Login successful", token });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// Fetch profile
exports.profile = async (req, res, next) => {
    try {
        const customer = await Customer.findByPk(req.user.id, {
            attributes: ["id", "name", "email"],
            include: [{ model: CustomerAddress, as: "addresses" }],
        });
        res.json(customer);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// Update Address
exports.updateAddress = async (req, res, next) => {
    try {
        const { latitude, longitude } = req.body;

        const address = await CustomerAddress.findOne({ where: { customer_id: req.user.id } });

        if (!address) {
            await CustomerAddress.create({ customer_id: req.user.id, latitude, longitude });
        } else {
            address.latitude = latitude;
            address.longitude = longitude;
            await address.save();
        }

        res.json({ message: "Address updated", address });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};
