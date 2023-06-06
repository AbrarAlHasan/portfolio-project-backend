import mongoose from "mongoose";
import { findRestaurant } from "../../utils/Deliveryo/findReferenceId.js";

const DishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide Your Dish Name"],
    min: [3, "Minimum 3 Character Required"],
  },
  shortDescription: {
    type: String,
  },
  price: {
    type: Number,
    required: [true, "Please Provide the Dish Price"],
  },
  imageUrl: {
    type: String,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryoRestaurant",
    required: true,
    validate: {
      validator: (value) => findRestaurant(value),
      message: "Restuarant Reference Error",
    },
  },
});

const DeliveryoDish = mongoose.model("DeliveryoDish", DishSchema);

export default DeliveryoDish;
