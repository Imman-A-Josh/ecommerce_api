const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization token missing" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const role = decoded.role;

        if (role == 'customer') {

            req.user = {
                id: decoded.id,
                role: decoded.role,
                account_id: decoded.account_id,
                store_id: decoded.store_id
            };

            next();

        } else {
            return res.status(401).json({ message: "Invalid token" });
        }

    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
