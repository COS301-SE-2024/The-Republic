"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const issueRoutes_1 = __importDefault(require("./routes/issueRoutes"));
const middleware_1 = require("./middleware/middleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(middleware_1.serverMiddleare);
app.use("/api/issues", issueRoutes_1.default);
app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        id: Math.floor(Math.random() * 500) + 1,
        data: "Welcome to InfiniteLoopers Node-Express App",
    });
});
exports.default = app;
