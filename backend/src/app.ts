import express from "express";
import issueRoutes from "@/modules/issues/routes/issueRoutes";
import reactionRoutes from "@/modules/reactions/routes/reactionRoutes";
import userRoutes from "@/modules/users/routes/userRoutes";
import commentRoutes from "@/modules/comments/routes/commentRoutes";
import visualizationRoutes from "@/modules/visualizations/routes/visualizationRoutes";
import reportsRoutes from "@/modules/reports/routes/reportsRoutes";
import locationRoutes from "@/modules/locations/routes/locationRoutes";
import subscriptionsRoutes from "@/modules/subscriptions/routes/subscriptionsRoutes";
import pointsRoutes from "@/modules/points/routes/pointsRoutes";
import clusterRoutes from "@/modules/clusters/routes/clusterRoutes";
import noAuthRoutes from "@/modules/users/routes/noAuthRoutes";
import organizationRoutes from "@/modules/organizations/routes/organizationRoutes";
import { serverMiddleare } from "@/middleware/middleware";

const app = express();

app.use(express.json());

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
  } else {
    next();
  }
});

app.use(serverMiddleare);
app.use("/api/issues", issueRoutes);
app.use("/api/reactions", reactionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/visualization", visualizationRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/subscriptions", subscriptionsRoutes);
app.use("/api/points", pointsRoutes);
app.use('/api/clusters', clusterRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/validate", noAuthRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    id: Math.floor(Math.random() * 500) + 1,
    data: "Welcome to The-Republic Node-Express App",
  });
});

export default app;
