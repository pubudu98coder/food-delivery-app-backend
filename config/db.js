import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();
const url = process.env.DB_URL; 
export const connectDB = async () =>{
    try {
        await mongoose.connect(url);
    } catch (error) {
        console.log("Database connection failed");
        
    }
}