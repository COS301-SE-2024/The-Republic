import express from "express";
import multer from "multer";
import { getUserById, updateUserProfile } from "../controllers/userController";
import { verifyAndGetUser } from "../middleware/middleware";

const router = express.Router();
const upload = multer();

router.get("/:id", verifyAndGetUser, getUserById);
router.put("/:id", verifyAndGetUser, upload.single('profile_picture'), updateUserProfile);

export default router;