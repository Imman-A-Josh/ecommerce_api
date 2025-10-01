const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.createOrder = async (req, res) => {
    try {
        const customer_id = req.user.id;

        const cartItems = await Cart.findAll({ where: { customer_id }, include: ["product"] });
        if (!cartItems.length) return res.status(400).json({ message: "Cart is empty" });

        let total = 0;
        cartItems.forEach(item => total += item.price_snapshot * item.quantity);

        const order = await Order.create({ customer_id, total, status: "CREATED" });

        for (const item of cartItems) {
            await OrderItem.create({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price_snapshot: item.price_snapshot
            });
        }

        await Cart.destroy({ where: { customer_id } });

        const fullOrder = await Order.findByPk(order.id, { include: ["items"] });
        res.status(200).json(fullOrder);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
