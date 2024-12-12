import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from "./routes/Routes.js";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors());

dotenv.config();
const PORT = process.env.PORT;
const DATABASE_NAME = process.env.DATABASE_NAME;

mongoose.connect("mongodb://localhost:27017/" + DATABASE_NAME);

app.listen(PORT, () => {
  console.log("Server running...");
});

app.use(routes);
