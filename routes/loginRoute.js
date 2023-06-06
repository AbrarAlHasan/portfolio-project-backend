import { Router } from "express";
const router = Router();

import * as controller from "../controllers/authController.js";
import Auth from "../middleware/authUser.js";
import { mailGenerator } from "../controllers/mailer.js";
import { clearLocalVariables } from "../middleware/authUser.js";
import { verifyJWT } from "../middleware/authUser.js";

/**POST METHODS */
router
  .route("/register")
  .post(controller.generateOTP, mailGenerator, controller.register);

router.route("/login").post(controller.CheckIsVerified, controller.login);
router.route("/logout").post(controller.logout);

/**GET METHODS */

router.route("/generateOTP").get(clearLocalVariables, controller.generateOTP);
router.route("/verifyOTP").post(controller.verifyOTP);

/**PUT METHODS */
router.route("/user/:userId").put(Auth, controller.updateUser);

router.route("/users").get(verifyJWT, controller.getUsers);
router.route("/refreshToken").get(controller.handleRefreshToken);

export default router;
