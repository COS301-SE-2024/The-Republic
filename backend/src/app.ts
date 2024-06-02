import express from "express";
import issueRoutes from "./routes/issueRoutes";
import { exampleMiddleware } from "./middleware/middleware";

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

app.use(exampleMiddleware);
app.use("/api/issues", issueRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to My Express App");
});

export default app;
