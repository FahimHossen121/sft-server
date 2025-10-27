import express from "express";

const MainRoutes = express.Router();

const test = async (req, res) => {
  res.send("Test route is working");
};

MainRoutes.get("/test", test);
export { MainRoutes };
