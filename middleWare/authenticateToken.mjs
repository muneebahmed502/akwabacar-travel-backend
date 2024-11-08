import jwt from 'jsonwebtoken'; // Ensure this line is present

// Middleware to verify JWT and extract driverId
export const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Bearer token

    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, 'secret', (err, user) => {
        // if (err) return res.sendStatus(403); // Forbidden
        console.log("Authenticated user:", user); // Log the user details
        req.driverId = user._id; // Set driverId from JWT
        req.passengerId  = user._id
        next();
    });
};
