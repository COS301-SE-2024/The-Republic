"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const issueRoutes_1 = __importDefault(require("@/modules/issues/routes/issueRoutes"));
const reactionRoutes_1 = __importDefault(require("@/modules/reactions/routes/reactionRoutes"));
const userRoutes_1 = __importDefault(require("@/modules/users/routes/userRoutes"));
const commentRoutes_1 = __importDefault(require("@/modules/comments/routes/commentRoutes"));
const visualizationRoutes_1 = __importDefault(require("@/modules/visualizations/routes/visualizationRoutes"));
const reportsRoutes_1 = __importDefault(require("@/modules/reports/routes/reportsRoutes"));
const locationRoutes_1 = __importDefault(require("@/modules/locations/routes/locationRoutes"));
const subscriptionsRoutes_1 = __importDefault(require("@/modules/subscriptions/routes/subscriptionsRoutes"));
const pointsRoutes_1 = __importDefault(require("@/modules/points/routes/pointsRoutes"));
const clusterRoutes_1 = __importDefault(require("@/modules/clusters/routes/clusterRoutes"));
const organizationRoutes_1 = __importDefault(require("@/modules/organizations/routes/organizationRoutes"));
const middleware_1 = require("@/middleware/middleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const allowedOrigins = ['http://localhost:3000', 'https://the-republic-six.vercel.app'];
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    }
    else {
        next();
    }
});
app.use(middleware_1.serverMiddleare);
app.use("/api/issues", issueRoutes_1.default);
app.use("/api/reactions", reactionRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/comments", commentRoutes_1.default);
app.use("/api/visualization", visualizationRoutes_1.default);
app.use("/api/reports", reportsRoutes_1.default);
app.use("/api/locations", locationRoutes_1.default);
app.use("/api/subscriptions", subscriptionsRoutes_1.default);
app.use("/api/points", pointsRoutes_1.default);
app.use('/api/clusters', clusterRoutes_1.default);
app.use("/api/organizations", organizationRoutes_1.default);
app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        id: Math.floor(Math.random() * 500) + 1,
        data: "Welcome to The-Republic Node-Express App",
    });
});
exports.default = app;
