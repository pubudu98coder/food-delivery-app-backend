import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique:true
    },
    description: {
        type: String, 
        required: [true, 'Description is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min:[0, 'Price must be at least 0']
    },
    image: {
        type: String,
        required: [true, 'Image is required']
    },
    category: {
        type: String,
        required: true,
        enum:{
            values: ['Salad', 'Rolls', 'Deserts', 'Sandwich', 'Cake', 'Pure Veg', 'Pasta','Noodles'],
            message: 'Category must be one of Salad, Rolls, Deserts, Sandwich, Cake, Pure Veg, Pasta,Noodles'
        }
    }
});

const foodModel = mongoose.models.food || mongoose.model('food', foodSchema);

export default foodModel;

