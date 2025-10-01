const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.addToCart = async (req, res) => {
    try {
        const customer_id = req.user.id;
        const { product_id, quantity } = req.body;

        if (!product_id || !quantity) {
            return res.status(400).json({ message: "Product and quantity required" });
        }

        const product = await Product.findByPk(product_id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Check if already in cart
        let cartItem = await Cart.findOne({ where: { customer_id, product_id } });

        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            cartItem = await Cart.create({
                customer_id,
                product_id,
                quantity,
                price_snapshot: product.price
            });
        }

        res.status(201).json({ message: "Product Added to Cart" });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const customer_id = req.user.id;
        const cartItems = await Cart.findAll({
            where: { customer_id },
            include: ["product"]
        });
        res.json(cartItems);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const customer_id = req.user.id;
        const { product_id } = req.body;
        await Cart.destroy({ where: { customer_id, product_id } });
        res.json({ message: "Item removed from cart" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
