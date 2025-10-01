const Razorpay = require("../config/razorpay");
const Order = require("../models/Order");
const crypto = require("crypto");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS 
    }
});


exports.createRazorpayOrder = async (req, res) => {
    try {
        const { order_id } = req.body;
        const order = await Order.findOne({ where: { order_id } });

        if (!order) return res.status(400).json({ message: "Order not found" });

        const options = {
            amount: Math.round(order.total * 100),
            currency: "INR",
            receipt: order.order_id,
            payment_capture: 1
        };

        const razorpayOrder = await Razorpay.orders.create(options);

        res.json({ razorpayOrder });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const generated_signature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid signature" });
        }

        const order = await Order.findOne({ where: { order_id: razorpay_order_id } });
        order.status = "PAID";
        await order.save();

        const cartItems = await order.getItems({ include: ["product"] });
        for (const item of cartItems) {
            item.product.stock -= item.quantity;
            await item.product.save();
        }

        res.json({ message: "Payment successful", order });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.webhook = async (req, res) => {
    try {
        const signature = req.headers["x-razorpay-signature"];

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(JSON.stringify(req.body))
            .digest("hex");

        if (generated_signature !== signature) {
            return res.status(400).json({ message: "Invalid webhook signature" });
        }

        const event = req.body.event;

        if (event === "payment.captured") {
            const payment = req.body.payload.payment.entity;

            const order = await Order.findOne({ where: { razorpay_order_id: payment.order_id } });
            if (order && order.status !== "PAID") {
                order.status = "PAID";
                await order.save();

                const cartItems = await order.getItems({ include: ["product"] });
                for (const item of cartItems) {
                    item.product.stock -= item.quantity;
                    await item.product.save();
                }

                console.log("Order marked as PAID via webhook");

                await transporter.sendMail({
                    from: process.env.SMTP_USER,
                    to: order.customer_email,
                    subject: "Order Confirmation - Payment Successful",
                    html: `
                        <h2>Thank you for your order!</h2>
                        <p>Your payment of <b>₹${order.total}</b> has been received.</p>
                        <p>Order ID: <b>${order.order_id}</b></p>
                        <p>Payment ID: <b>${payment.id}</b></p>
                        <p>We will process your order soon </p>
                    `
                });

                console.log("Confirmation email sent");
            }
        }

        res.json({ status: "ok" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


