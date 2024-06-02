"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const exampleController_1 = require("../controllers/exampleController");
const router = (0, express_1.Router)();
// Route to get all examples
router.get("/", exampleController_1.exampleController.getAllExamples);
// Route to get a single example by ID
router.get("/:id", exampleController_1.exampleController.getExampleById);
// Route to create a new example
router.post("/", exampleController_1.exampleController.createExample);
// Route to update an example by ID
router.put("/:id", exampleController_1.exampleController.updateExample);
// Route to delete an example by ID
router.delete("/:id", exampleController_1.exampleController.deleteExample);
exports.default = router;
