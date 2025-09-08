const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const app = express();
const port = 3000;


app.use(cors());
app.use(express.json());

// reponse limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 1000, // 1k req per 15m
    message: 'Too many requests, please try again later.'
});

// current location store malpundu
let currentLocation = {
    lat: 12.819194,
    lng: 74.841361
};

// not completed
const authenticateDriver = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader === 'Bearer YOUR_DRIVER_TOKEN') {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

//driver na loc update
app.post('/update-location', apiLimiter, authenticateDriver, (req, res) => {
    const { lat, lng, driverId } = req.body;

    
    if (typeof lat !== 'number' || typeof lng !== 'number' || !driverId) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    // Update loc
    currentLocation = { lat, lng };
    res.status(200).json({ message: 'Location updated', location: currentLocation });
});

app.get('/get-location', (req, res) => {
    res.status(200).json(currentLocation);
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});