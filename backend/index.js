const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth");
//app.use("/api/auth", authRoutes);
const passwordRoutes = require("./routes/passwords");
const cookieParser = require("cookie-parser");






dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});
app.use(cors({
  origin: process.env.CORS_ORIGIN, // your frontend origin
  credentials: true,
}));
app.use("/api", authRoutes);
app.use("/api", passwordRoutes);
app.use("/api/passwords", passwordRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


