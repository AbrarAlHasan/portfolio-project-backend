import { Router } from "express";
import * as controller from "../../controllers/Deliveryo/deliveryoController.js";

const router = Router();

router.route("/featured").get(controller.getFeaturedList);
router.route("/featured").post(controller.addFeaturesList);

router.route("/restaurant").post(controller.addRestaurant);
router.route("/restaurant/:id").get(controller.getRestaurant);
router.route("/restaurants").get(controller.getRestaurants);

router.route("/restaurant/:id/dish").post(controller.addDish);
router.route("/restaurant/:id/dishes").get(controller.getDishes);

export default router;
