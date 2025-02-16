const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const GOOGLE_MAPS_API_KEY = "AIzaSyBXRGnwFpUQYKBIEnZ-yJaVTgkK3itcot4";

app.get("/api/directions", async (req, res) => {
    const { origin, destination, mode } = req.query;

    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/directions/json`,
            {
                params: {
                    origin,
                    destination,
                    mode,
                    departure_time: "now",
                    key: GOOGLE_MAPS_API_KEY,
                },
            }
        );

        res.json(response.data);
        console.log(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch directions" });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
