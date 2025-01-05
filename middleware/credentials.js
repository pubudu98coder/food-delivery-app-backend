import alloweOrigins from "../config/allowedOrigins.js";

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (alloweOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true)
    }
    next();
}

export default credentials;