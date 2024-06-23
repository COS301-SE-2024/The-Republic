import express from "express";
import issueRoutes from "./routes/issueRoutes";
import reactionRoutes from "./routes/reactionRoutes";
import userRoutes from "./routes/userRoutes";
import commentRoutes from "./routes/commentRoutes";
import visualizationRoutes from "./routes/visualizationRoutes";
import reportsRoutes from "./routes/reportsRoutes";
import { serverMiddleare } from "./middleware/middleware";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
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

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    id: Math.floor(Math.random() * 500) + 1,
    data: "Welcome to InfiniteLoopers Node-Express App",
  });
});

export default app;
