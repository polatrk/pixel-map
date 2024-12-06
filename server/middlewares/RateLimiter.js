const rateLimit = require('express-rate-limit');

const rateLimiter = (maxRequests, minutes) => {
    return rateLimit({
        windowMs: minutes * 1000, // 15 minutes by default
        max: maxRequests, // Dynamic limit per IP
        message: { message: "Too many requests, please try again later." },
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable `X-RateLimit-*` headers
        handler: (req, res, next, options) => {
            return res.status(429).send({ message: "Too many requests" });
        }
    });
};

module.exports = rateLimiter
