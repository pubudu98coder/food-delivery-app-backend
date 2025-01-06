import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';
import authMiddleWare from '../middleware/authMiddleWare.js';
import verifyRoles from '../middleware/verifyRoles.js';
import roleList from '../config/roleList.js';

const cartRouter = express.Router();

cartRouter.post('/add', verifyRoles(roleList.ADMIN),addToCart);
cartRouter.post('/remove', verifyRoles(roleList.ADMIN),removeFromCart);
cartRouter.post('/get',verifyRoles(roleList.ADMIN, roleList.USER), getCart)


// cartRouter.post('/add', authMiddleWare, addToCart);
// cartRouter.post('/remove', authMiddleWare, removeFromCart);
// cartRouter.post('/get', authMiddleWare, getCart)

export default cartRouter;