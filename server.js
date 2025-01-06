import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoutes.js';
import 'dotenv/config.js'
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import { errorHandler } from './middleware/errorHandler.js';
import authMiddleWare from './middleware/authMiddleWare.js';
import corsOptions from './config/corsOptions.js'
import cookieParser from 'cookie-parser';
import credentials from './middleware/credentials.js';
import mongoose from 'mongoose';

//env cofiguration
dotenv.config();

//db connection
connectDB();

//app configuration
const app = express();
const port = process.env.PORT || 5000

//credentials
app.use(credentials);

//Cross origin resource sharing
app.use(cors(corsOptions));

//built in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//api endpoints
app.use('/api/food', foodRouter);
app.use('/api/user', userRouter);
app.use('/api/order', orderRouter);
app.use('/images', express.static('uploads'));

//the endpoints after this needs authorization
app.use(authMiddleWare);
app.use('/api/cart',cartRouter);

//error handling middleware
app.use(errorHandler)

app.get('/', (req, res) => {
    res.send("API is working");
});

mongoose.connection.once('open', () =>{
    console.log("Database connection successfull");
    app.listen(port,()=>{
        console.log(`Server started on http://localhost:${port}`)
    });
});



