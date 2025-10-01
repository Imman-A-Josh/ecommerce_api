const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token, auth denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        const role = decoded.role;

        if (role == 'admin') {
            next();
        } else {
            return res.status(401).json({ message: "Invalid token" });
        }
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
