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

dotenv.config();

//app configuration
const app = express();
const port = process.env.PORT || 5000

app.use(credentials);

//Cross origin resource sharing
// app.use(cors({
//     origin: 'http://localhost:5173', // Replace with your frontend's URL
//     credentials: true,
// }));
app.use(cors(corsOptions));

//built in middleware for json
app.use(express.json());

//db connection
connectDB();



//middleware for cookies
app.use(cookieParser());

//api endpoints
app.use('/api/food', foodRouter);
app.use('/api/user', userRouter);
app.use('/api/order', orderRouter);
app.use('/images', express.static('uploads'));
app.use(authMiddleWare);
app.use('/api/cart',cartRouter);

app.use(errorHandler)


app.get('/', (req, res) => {
    res.send("API is working");
});


app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`)
});


