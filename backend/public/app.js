"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exampleRoute_1 = __importDefault(require("./routes/exampleRoute"));
const exampleMiddleware_1 = require("./middleware/exampleMiddleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
app.use(exampleMiddleware_1.exampleMiddleware);
app.use("/api/example", exampleRoute_1.default);
app.get("/", (req, res) => {
  res.send("Welcome to My Express App");
});
exports.default = app;
