import express from "express";
import issueRoutes from "@/modules/issues/routes/issueRoutes";
import reactionRoutes from "@/modules/reactions/routes/reactionRoutes";
import userRoutes from "@/modules/users/routes/userRoutes";
import commentRoutes from "@/modules/comments/routes/commentRoutes";
import visualizationRoutes from "@/modules/visualizations/routes/visualizationRoutes";
import reportsRoutes from "@/modules/reports/routes/reportsRoutes";
import locationRoutes from "@/modules/locations/routes/locationRoutes";
import pointsRoutes from "@/modules/points/routes/pointsRoutes";
import clusterRoutes from "@/modules/clusters/routes/clusterRoutes";
import { serverMiddleare } from "@/middleware/middleware";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  next();
});

app.use(serverMiddleare);
app.use("/api/issues", issueRoutes);
app.use("/api/reactions", reactionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/visualization", visualizationRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/points", pointsRoutes);
app.use('/api/clusters', clusterRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    id: Math.floor(Math.random() * 500) + 1,
    data: "Welcome to The-Republic Node-Express App",
  });
});

export default app;
