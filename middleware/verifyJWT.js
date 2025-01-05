import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    try {
        console.log("authHeader", authHeader); 
        if (!authHeader) {
            throw new AppError("Unauthorized", 401);
        }
        const token = authHeader.split(" ")[1]; // to separate token (authHeader :bearer token)
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {
                if (err) {
                    throw new AppError("Inavalid token", 403);
                }
                req.body.userId = decoded.userId;
                next();
            }
        );
    } catch (error) {
        next(error);
    }
}

export default verifyJWT;