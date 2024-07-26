import express from "express";
import multer from "multer";
import { getUserById, updateUserProfile } from "@/modules/users/controllers/userController";
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

export default router;
