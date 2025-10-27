import express from "express";
import cors from "cors";
import "dotenv/config";
import { MainRoutes } from "./routes.js";
const app = express();

app.use(express.json());
app.use("/api/v1", MainRoutes);
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.status(404).send({
    msg: "No routes in this location",
    statusCode: 404,
    data: null,
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (process.env.MODE === "DEV") {
    res.status(500).send({
      msg: err.message || "Internal Server Error",
      stack: err.stack,
      statusCode: 500,
      data: null,
    });
  } else {
    res.status(500).send({
      msg: "Something went wrong",
      statusCode: 500,
      data: null,
    });
  }
});

// Health check route (optional but handy)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export { app };
