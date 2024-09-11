import express from "express";
import multer from "multer";
import { getUserById, updateUserProfile, updateUsername, changePassword } from "@/modules/users/controllers/userController";
import { verifyAndGetUser } from "@/middleware/middleware";

const router = express.Router();
const upload = multer();

router.post("/:id", verifyAndGetUser, getUserById);
router.put(
  "/:id",
  verifyAndGetUser,
  upload.single("profile_picture"),
  updateUserProfile,
);

router.put(
  "/:id/username",
  verifyAndGetUser,
  updateUsername
);

router.put(
  "/:id/password",
  verifyAndGetUser,
  changePassword
);

export default router;
