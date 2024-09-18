import { Router } from "express";
import multer from "multer";
import * as userController from "@/modules/users/controllers/userController";
import { verifyAndGetUser } from "@/middleware/middleware";

const router = Router();
const upload = multer();

router.post(
  "/:id",
  verifyAndGetUser,
  userController.getUserById
);

router.put(
  "/:id",
  verifyAndGetUser,
  upload.single("profile_picture"),
  userController.updateUserProfile
);

router.put(
  "/:id/username",
  verifyAndGetUser,
  userController.updateUsername
);

router.put(
  "/:id/password",
  verifyAndGetUser,
  userController.changePassword
);

export default router;
