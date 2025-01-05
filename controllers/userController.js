import bcrypt, { genSalt } from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import userModel from '../models/userModel.js';
import AppError from '../utils/AppError.js'

const createJWTToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET);
}

const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        
        const exist = await userModel.findOne({email});
        if (exist) {
            return res.json({success: false, message: "User email already exist"});
        }

        if (!validator.isEmail(email)) {
            return res.json({success: false, message: "Email is not valid" });
            
        }

        if (password.length < 8) {
            return res.json({success: false, message: "Password length is insufficient"});
        }
        
        //encrypting the password
        const salt = await bcrypt.genSalt(10);
        const hashedPW = await bcrypt.hash(password, salt);
        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPW
        });

        const user = await newUser.save();
        if (user) {
            const token = createJWTToken(user._id);                
            return res.json({success: true, token});
        }
    } catch (error) {
        console.log(error);
        return res.json({success: false, message: "User registration failed"});
    }
}

const login = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        if (!email || !password) {
            throw new AppError("Email and password required", 400);
        }
        const user = await userModel.findOne({email});
        if (!user) {
            throw new AppError("Email doesn't exist", 404);       
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            // const token = createJWTToken(user._id);
            const accessToken = jwt.sign(
                {"userId":user._id},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'30s'},
                { algorithm: 'RS256' }
            );

            const refreshToken = jwt.sign(
                {"userId": user._id},
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn: '1d'},
                { algorithm: 'RS256' }
            );

            await userModel.findByIdAndUpdate(user._id, {refreshToken: refreshToken});
            res.cookie('jwt', refreshToken, {httpOnly: true, sameSite:'None', secure:true, maxAge: 24*60*60*1000})
                .status(200).json({success: true , accessToken, message: "Authentication is successful"});
        } else {
            throw new AppError("Invalid credentials", 401);
        }
    } catch (error) {
        next(error);
    } 
}

const refreshToken = async (req, res, next) => {
    const cookies = req.cookies;
    console.log("cookie", cookies);
    
    try {
        if (!cookies?.jwt) {
            throw new AppError("Unauthorized", 401);
        }

        const refreshToken = cookies.jwt;

        const user = await userModel.findOne({refreshToken: refreshToken});

        if (!user) {
            throw new AppError("Forbidden", 403);
        }

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (error, decoded) => {
                if (error || user._id.toString() !== decoded.userId) {
                    throw new AppError("Forbiddend", 403);
                }

                const accessToken =  jwt.sign(
                    {"userId": user._id},
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn:'30s'},
                    {algorithm: 'RS256'}
                );

                res.status(200).json({success: false, accessToken, message: "Token refreshed successfully"});
            }
        );
    } catch (error) {
        next(error);
    } 
}

const logout = async (req, res, next) => {
    const cookies = req.cookies;
    console.log("cookie:",cookies )
    try {
        if (!cookies?.jwt) {
            console.log("empty cokkie")
            return res.sendStatus(204);}

        const refreshToken = cookies.jwt;
        const user = await userModel.findOne({refreshToken:refreshToken});
        if (!user) {
            console.log("use empty")
            res.clearCookie('jwt', {httpOnly:true, sameSite:'None', secure:true});
            return res.sendStatus(204);
        }

        await userModel.findByIdAndUpdate(user._id, {refreshToken: null})
        res.clearCookie('jwt', {httpOnly:true});
        return res.status(200).json({success:true , message: "Logout successfully"});
    } catch (error) {
        next(error);
    }
}

export {register, login, refreshToken, logout} 

