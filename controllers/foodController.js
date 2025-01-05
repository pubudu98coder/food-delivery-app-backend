import foodModel from "../models/foodModel.js";
import fs from "fs";
import {
  addFoodService,
  listFoodService,
  removeFoodService,
} from "../services/foodService.js";
import AppError from "../utils/AppError.js";
import { responseHandler } from "../utils/util.js";
import { foodSchema } from "../middleware/validators/validatorSchema.js";

//add food item
const addFood = async (req, res, next) => {
  const { name, description, price, category } = req.body;
  let image_filename = `${req.file.filename}`;
  const foodData = {
    name: name,
    description: description,
    price: price,
    category: category,
    image: image_filename,
  };

  const { error, value } = foodSchema.validate(foodData, { abortEarly: false });

  try {
    if (error) {
      throw error;
    } else {
      const newFoood = new foodModel(value);
      const food = await newFoood.save();
      return responseHandler(
        res,
        { success: true, food, message: "Food item succesfully added" },
        201
      );
    }
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Food item already added" });
    }
    next(err);
  }
};

//list all foods
const listFood = async (req, res, next) => {
  try {
    const foodList = await foodModel.find();
    res.status(200).json({ success: true, data: foodList });
  } catch (error) {
    next(error);
  }
};

//remove food item
const removeFood = async (req, res, next) => {
	const id =  req.params.id;
	try {	
		if (id) {
			const food = await foodModel.findByIdAndDelete(id);

			if (!food){
				throw new AppError("Food item with the provided id does not exist", 404)
			} else {
				res.status(200).json({success: true, food, message: "Food item succesfully removed"});
				fs.unlink(`uploads/${food.image}`, () => {
					console.log("File deleted from upload folder");
				});
			}
		}
	} catch (error) {
		next(error);
	}
};

const getFoodById = async (req, res) => {};

export { addFood, listFood, removeFood };
