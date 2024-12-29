import bcrypt, { genSalt } from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import userModel from '../models/userModel.js';

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

const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await  userModel.findOne({email});
        if (!user) {
            return res.json({success: false, message: "User doesn't exist"});        
        }
        // const salt = await bcrypt.genSalt(10);
        // const hashedPW = await bcrypt.hash(password, salt);
        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = createJWTToken(user._id);
            return res.json({success: true , token});
        } else {
            return res.json({success: false, message:  "Invalid credentials"});
        }

    } catch (error) {
        console.log(error);
        return res.json({success: false, message: "Internal server Error"});
    }
    
    
}

export {register, login} 

