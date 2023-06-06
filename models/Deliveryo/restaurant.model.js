import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide the Restaurant Name"],
    min: [3, "Minimum 3 Character Required"],
  },
  shortDescription: {
    type: String,
  },
  imageUrl: {
    type: String,
    default:
      "https://www.google.com/imgres?imgurl=https%3A%2F%2Fe7.pngegg.com%2Fpngimages%2F716%2F758%2Fpng-clipart-graphics-restaurant-logo-restaurant-thumbnail.png&imgrefurl=https%3A%2F%2Fwww.pngegg.com%2Fen%2Fsearch%3Fq%3DRESTAURANT&tbnid=JWzUGCj5EE7IwM&vet=12ahUKEwiG37DElN79AhXHKrcAHV8NAhoQMygDegUIARDNAQ..i&docid=T7J8jM-_nFhh2M&w=348&h=348&q=restaurant%20thumbnail&ved=2ahUKEwiG37DElN79AhXHKrcAHV8NAhoQMygDegUIARDNAQ",
  },
  latitude: {
    type: Number,
    required: [true, "Please Provide Latitude of the Restaurant"],
  },
  longitude: {
    type: Number,
    required: [true, "Please Provide Longitude of the Restaurant"],
  },
  address: {
    type: String,
    required: [true, "Please Provide Address of the Restaurant"],
    min: [10, " Min 10 Characters Required"],
  },
  rating: {
    type: Number,
    required: [true, "Rating of the Restaurant is Required"],
    min: 1,
    max: 5,
  },
  // category: {
  //   required: [true, "Category of the Restaurant is Required"],
  //   type: String,
  //   min: 3,
  // },
});

const DeliveryoRestaurant = mongoose.model(
  "DeliveryoRestaurant",
  RestaurantSchema
);

export default DeliveryoRestaurant;
