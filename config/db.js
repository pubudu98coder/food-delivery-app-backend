import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();
const url = process.env.DB_URL; 
export const connectDB = async () =>{
    mongoose.connect(url)
        .then(() => {
            console.log("Database connected");
        })
        .catch(() => {
            console.log("Database connection failed");
        });
}