import { Request, Response } from "express";
import cloudinary from "../utils/cloudinary";
import { Menu } from "../models/menu.model";
import { Restaurant } from "../models/resturant.model";
import uploadImageOnCloudinary from "../utils/imageUpload";
// import mongoose from "mongoose";
import mongoose, { ObjectId } from "mongoose";

export const addMenu = async (req: Request, res: Response):Promise<any> => {
  try {
    const { name, description, price } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: " file need to be  uploaded",
      });
    }
    const restaurant = await Restaurant.findOne({ user: req.id });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found. Please create a restaurant first.",
      });
    }
    
    const imageURL = await uploadImageOnCloudinary(file as Express.Multer.File);
    const menu = new Menu({
      name,
      description,
      price,
      image: imageURL,
      restaurant: restaurant._id, // Associate menu with restaurant
    });
    await menu.save();
    
    // Add menu to restaurant's menus array
    (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id);
    await restaurant.save();
    res.status(200).json({
      success: true,
      message: "Menu added successfully",
       menu,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const editMenu = async (req: Request, res: Response):Promise<any> => {
  try {
      const {id} = req.params;
      const {name,description,price}=req.body;
        const file = req.file;
        
        // First, find the restaurant that owns this menu to verify authorization
        const restaurant = await Restaurant.findOne({ user: req.id, menus: id });
        if (!restaurant) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to edit this menu"
            });
        }
        
        const menu = await Menu.findById(id);
        if(!menu){
            return res.status(404).json({
                success:false,
                message:"Menu not found!"
            })
        }
        if(name) menu.name = name;
        if(description) menu.description = description;
        if(price) menu.price = price;

        if(file){
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            menu.image = imageUrl;
        }
        await menu.save();

        return res.status(200).json({
            success:true,
            message:"Menu updated",
            menu,
        })

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteMenu = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    
    // First, verify that the user owns the restaurant that has this menu
    const restaurant = await Restaurant.findOne({ user: req.id, menus: id });
    if (!restaurant) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this menu"
      });
    }
    
    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found!"
      });
    }

    // Remove menu from restaurant's menus array (using the restaurant we already found)
    restaurant.menus = (restaurant.menus as mongoose.Schema.Types.ObjectId[]).filter(
      (menuId) => menuId.toString() !== id
    );
    await restaurant.save();

    // Delete the menu
    await Menu.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Menu deleted successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
