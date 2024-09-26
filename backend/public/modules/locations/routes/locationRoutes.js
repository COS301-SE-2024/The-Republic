"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const locationController_1 = require("@/modules/locations/controllers/locationController");
const router = express_1.default.Router();
router.post("/", locationController_1.getAllLocations);
router.get("/:id", locationController_1.getLocationById);
exports.default = router;
