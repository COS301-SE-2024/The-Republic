import { Router } from "express";
import multer from "multer";
import * as userController from "@/modules/users/controllers/userController";
import { verifyAndGetUser } from "@/middleware/middleware";

const router = Router();
router.use(verifyAndGetUser);
const upload = multer();

router.post(
  "/:id",
  userController.getUserById
);

router.put(
  "/:id",
  upload.single("profile_picture"),
  userController.updateUserProfile
);

router.put(
  "/:id/username",
  userController.updateUsername
);

router.put(
  "/:id/password",
  userController.changePassword
);

router.post(
  "/username/exists",
  userController.usernameExists
);


export default router;