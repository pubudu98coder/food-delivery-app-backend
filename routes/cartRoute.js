import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';
import authMiddleWare from '../middleware/authMiddleWare.js';

const cartRouter = express.Router();

cartRouter.post('/add', addToCart);
cartRouter.post('/remove', removeFromCart);
cartRouter.post('/get', getCart)


// cartRouter.post('/add', authMiddleWare, addToCart);
// cartRouter.post('/remove', authMiddleWare, removeFromCart);
// cartRouter.post('/get', authMiddleWare, getCart)

export default cartRouter;