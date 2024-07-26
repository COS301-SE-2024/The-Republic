import express from "express";
import { getAllLocations } from "@/modules/locations/controllers/locationController";

const router = express.Router();

router.post("/", getAllLocations);

export default router;
