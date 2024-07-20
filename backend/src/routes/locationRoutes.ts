import express from "express";
import { getAllLocations } from "../controllers/locationController";

const router = express.Router();

router.get("/", getAllLocations);

export default router;