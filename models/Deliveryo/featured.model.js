import mongoose from "mongoose";
import { findRestaurants } from "../../utils/Deliveryo/findReferenceId.js";

const FeaturedSchema = new mongoose.Schema({
  featureName: {
    type: String,
    required: [true, "Please Provide Your Featured Name"],
    min: [3, "Minimum 3 Character Required"],
  },
  shortDescription: {
    type: String,
    required: [true, "Please Provide Your Short Description"],
    min: [3, "Minimum 3 Character Required"],
  },
  restaurantId: {
    type: [mongoose.Schema.ObjectId],
    required: true,
    ref: "DeliveryoRestaurant",
    validate: { validator: (value) => findRestaurants(value) },
  },
});

const DeliveryoFeatured = mongoose.model("DeliveryoFeatured", FeaturedSchema);

export default DeliveryoFeatured;
