import express from "express";
import { getUserById } from "../controllers/userController";

const router = express.Router();

router.get("/:id", getUserById);

export default router;
