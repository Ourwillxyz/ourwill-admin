import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import registerRouter from "./routes/register.js"; // path may vary

const app = express();

// Middleware
app.use(cors({
  origin: "https://ourwill.vercel.app", // allow your frontend domain
  credentials: true
}));
app.use(express.json()); // parse JSON bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Use the register route
app.use("/api", registerRouter); // /api/register will be your endpoint

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
