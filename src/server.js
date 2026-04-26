import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import podcastRoutes from "./routes/podcastRoutes.js";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: [
    "http://localhost:5174",
    "http://localhost:5173",
    "https://podcast-pipeline-backend.onrender.com",
    "https://podcast-pipeline-six.vercel.app"
  ]
}));

app.use(express.json());
app.use("/api/podcasts", podcastRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🎙️ Server running on port ${PORT}`);
  });
});
