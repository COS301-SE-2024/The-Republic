import {
  usernameExists,
  getUserById,
  updateUserProfile,
  updateUsername,
  changePassword
} from "@/modules/users/controllers/userController";
import { verifyAndGetUser } from "@/middleware/middleware";
import { Router } from "express";
import multer from "multer";

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
  usernameExists
);


export default router;
