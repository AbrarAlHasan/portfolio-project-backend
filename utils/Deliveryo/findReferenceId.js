import DeliveryoRestaurant from "../../models/Deliveryo/restaurant.model.js";

export const findRestaurant = (id) => DeliveryoRestaurant.findById(id);

export const findRestaurants = async (id) => {
  const restaurants = await DeliveryoRestaurant.find({ _id: { $in: id } });

  return restaurants.length > 1 ? restaurants.length === id.length : false;
};
