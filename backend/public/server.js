"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Uncomment line bellow when when Working locally
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 8080;
app_1.default.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
