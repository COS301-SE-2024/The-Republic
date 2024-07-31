import express from "express";
import { getAllLocations, getLocationById } from "@/modules/locations/controllers/locationController";

const router = express.Router();

router.post("/", getAllLocations);
router.get("/:id", getLocationById);

export default router;
