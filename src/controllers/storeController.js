const { QueryTypes } = require("sequelize");
const sequelize = require("../config/db");

exports.getNearbyStores = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: "Latitude and Longitude are required" });
        }

        const stores = await sequelize.query(
            `
      SELECT 
        s.*, 
        (6371 * acos(
          cos(radians(:lat)) * cos(radians(s.latitude)) *
          cos(radians(s.longitude) - radians(:lng)) +
          sin(radians(:lat)) * sin(radians(s.latitude))
        )) AS distance_km
      FROM stores s
      HAVING distance_km <= 5
      ORDER BY distance_km ASC;
      `,
            {
                replacements: { lat: latitude, lng: longitude },
                type: QueryTypes.SELECT,
            }
        );

        res.json(stores);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
