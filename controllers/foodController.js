import foodModel from "../models/foodModel.js";
import fs from "fs";

//add food item
const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });

  try {
    await food.save();
    console.log("Food item successfully added")
    res.json({ success: true, message: "Food item added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//list all foods
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    if (!food) {
      res.json({ success: false, message: "Food not found" });
      return;
    }

    //delete image from folder
    fs.unlink(`uploads/${food.image}`, () => {
      console.log("File deleted from upload folder");
    });
    //delete image string from database
    await foodModel.findByIdAndDelete(req.params.id);

    res.json({ success: true, data: food ,message:"Food deleted successfully"});
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const getFoodById = async (req, res) => {
    
}

export { addFood, listFood, removeFood };
