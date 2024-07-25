import express from "express";
import { getAllLocations } from "../controllers/locationController";

const router = express.Router();

router.post("/", getAllLocations);

export default router;
