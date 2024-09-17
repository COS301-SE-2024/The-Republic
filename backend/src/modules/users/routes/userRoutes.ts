import { Router } from "express";
import multer from "multer";
import {
  getUserById,
  updateUserProfile,
  updateUsername,
  changePassword,
  checkUsernameAvailability
} from "@/modules/users/controllers/userController";
import { verifyAndGetUser } from "@/middleware/middleware";

const router = Router();
router.use(verifyAndGetUser);
const upload = multer();

router.post(
  "/:id",
  getUserById
);

router.put(
  "/:id",
  upload.single("profile_picture"),
  updateUserProfile,
);

router.put(
  "/:id/username",
  updateUsername
);

router.put(
  "/:id/password",
  changePassword
);

router.post(
  "/username/exists",
  checkUsernameAvailability
);

export default router;
