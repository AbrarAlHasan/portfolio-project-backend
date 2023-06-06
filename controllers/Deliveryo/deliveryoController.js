import mongoose from "mongoose";
import DeliveryoDish from "../../models/Deliveryo/Dish.model.js";
import DeliveryoFeatured from "../../models/Deliveryo/featured.model.js";
import DeliveryoRestaurant from "../../models/Deliveryo/restaurant.model.js";

export const getFeaturedList = async (req, res) => {
  try {
    const featured = await DeliveryoFeatured.find().populate({
      path: "restaurantId",
      select: "_id name imageUrl rating address",
    });
    return res.status(200).json(featured);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

export const addFeaturesList = async (req, res) => {
  try {
    const { featureName, shortDescription, restaurantId } = req.body;
    const featured = new DeliveryoFeatured({
      featureName,
      shortDescription,
      restaurantId,
    });
    const featuredSaved = await featured.save();
    return res.status(200).json(featuredSaved);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

export const addRestaurant = async (req, res) => {
  try {
    const {
      name,
      shortDescription,
      imageUrl,
      latitude,
      longitude,
      address,
      rating,
    } = req.body;
    const restaurant = new DeliveryoRestaurant({
      name,
      shortDescription,
      imageUrl,
      latitude,
      longitude,
      address,
      rating,
    });
    const restaurantSaved = await restaurant.save();
    return res.status(200).json(restaurantSaved);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

export const getRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    // const restaurant = await DeliveryoRestaurant.findById(id);
    const restaurant = await DeliveryoRestaurant.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "deliveryodishes",
          localField: "_id",
          foreignField: "restaurantId",
          as: "dishes",
        },
      },
    ]);

    return res.status(200).json(restaurant);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

export const getRestaurants = async (req, res) => {
  try {
    const restaurant = await DeliveryoRestaurant.find();
    return res.status(200).json(restaurant);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

export const addDish = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, shortDescription, price, imageUrl } = req.body;
    const dish = new DeliveryoDish({
      restaurantId: id,
      name,
      shortDescription,
      price,
      imageUrl,
    });
    const dishSaved = await dish.save();
    return res.status(200).json(dishSaved);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

export const getDishes = async (req, res) => {
  const { id } = req.params;
  try {
    const dishes = await DeliveryoDish.find({ restaurantId: id }).populate(
      "restaurantId"
    );
    return res.status(200).json(dishes);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
