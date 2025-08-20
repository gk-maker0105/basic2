const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./src/routes/auth");


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); // parse JSON request bodies
app.use("/api/resume", require("./src/routes/resume.routes"));
const morgan = require("morgan");
app.use(morgan("dev"));

// simple health check
app.get("/", (req, res) => res.send("API up"));

app.use("/api/auth", authRoutes);

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log("✅ Server running on port", process.env.PORT)
    );
  } catch (err) {
    console.error("❌ Failed to start:", err.message);
    process.exit(1);
  }
}

start();
