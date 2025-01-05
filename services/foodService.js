import { error } from "console";
import foodModel from "../models/foodModel.js";
import AppError from "../utils/AppError.js";
import fs from "fs";

// const addFoodService = async (foodData) => {
//   try {
//     const newFood = new foodModel(foodData);
//     const food = await newFood.save();
//     return {
//       success: true,
//       data: food,
//       message: "Food item added successfully",
//     };
//   } catch (error) {
//     throw new AppError("Error adding food item", 400);
//   }
// };

const addFoodService = async (foodData) => {

  const newFood = new foodModel(foodData);
  const food = await newFood.save();

  if (food.acknowledged) {
    return {
      success: true,
      data: food,
      message: "Food item added successfully",
    };
  } else {
    return {
      success: false,
      message: "Failed to add food item!",
    };
  }
};

const listFoodService = async () => {
  try {
    const foodList = await foodModel.find();
    return { success: true, data: foodList };
  } catch (error) {
    throw new AppError("Error fetching food data", 500);
  }
};

const removeFoodService = async (id) => {
  //   try {
  const food = await foodModel.findById(id);
  if (!food) {
    throw new AppError("Food not found", 404);
  }

  //delete image from folder
  fs.unlink(`uploads/${food.image}`, () => {
    console.log("File deleted from upload folder");
  });
  //delete image string from database
  await foodModel.findByIdAndDelete(id);
  return { success: true, message: "Food deleted succesfully" };
  //   } catch (error) {
  // 	console.log(error)
  // 	//throw new AppError("Error deleting food item !", 500);
  //   }
};

export { addFoodService, listFoodService, removeFoodService };
