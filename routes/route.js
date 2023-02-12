import { Router } from "express";
const router = Router();

import * as controller from "../controllers/authController.js";
import Auth, { localVariables } from "../middleware/authUser.js";
import { mailGenerator } from "../controllers/mailer.js";

/**POST METHODS */
router
  .route("/register")
  .post(controller.generateOTP, mailGenerator, controller.register);
// router.route('/registerMail').post();
router.route("/authenticate").post(controller.authenticate);
router.route("/login").post(controller.verifyUser, controller.login);

/**GET METHODS */
router.route("/user/:userId").get(controller.getUser);
router
  .route("/generateOTP")
  .get(controller.verifyUser, localVariables, controller.generateOTP);
router.route("/verifyOTP").get(controller.verifyUser, controller.verifyOTP);
router.route("createResetSession").get(controller.createResetSession);

/**PUT METHODS */
router.route("/user/:userId").put(Auth, controller.updateUser);
router
  .route("/resetPassword")
  .put(controller.verifyUser, controller.resetPassword);
router.route("/users").get(controller.getUsers);

export default router;
