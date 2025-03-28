import express, { Application } from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});

export default app;
