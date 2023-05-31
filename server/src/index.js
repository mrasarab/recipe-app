import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { userRouter } from "./routes/users.js";
import { recipeRouter } from "./routes/recipes.js";
import dotenv from "dotenv";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../../.env") });

const url = process.env.MONGODB_URL;
const app = express();

app.use(express.json());
app.use(cors());
app.use("/auth", userRouter);
app.use("/recipes", recipeRouter);

mongoose
  .connect(url)
  .then(() => console.log("MongoDB connected!"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.listen(3001, () => {
  console.log("server started");
});
