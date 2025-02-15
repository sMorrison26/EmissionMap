const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 5000;

// Enable CORS for your frontend
app.use(cors());

// Route to proxy Mapbox Directions API request
app.get('/api/directions', async (req, res) => {
  const { start, end } = req.query;

  try {
    const response = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start};${end}`,
      {
        params: {
          access_token: 'pk.eyJ1IjoiZGFuZ2IyNCIsImEiOiJjbTc2amR0NXIwdXphMmxwcnZtanprZXZzIn0.heEc3MDcr2E2grB7VXRKgw', // Make sure to replace with your actual token
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
