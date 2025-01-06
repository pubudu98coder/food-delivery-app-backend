import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

const authMiddleWare = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    try {
        console.log("authHeader", authHeader); 
        if (!authHeader?.startsWith('Bearer ')) {
            throw new AppError("Unauthorized", 401);
        }
        const token = authHeader.split(" ")[1]; // to separate token (authHeader :bearer token)
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {
                console.log("decoded", decoded);
                if (err) {
                    throw new AppError("Invalid token", 403);
                }
                req.body.userId = decoded.userInfo.userId;
                req.body.roleList = decoded.userInfo.roleList 
                next();
            }
        );
    } catch (error) {
        next(error);
    }
}

export default authMiddleWare;