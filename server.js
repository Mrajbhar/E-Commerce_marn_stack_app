import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectdb from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutees from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRouters.js";
import bannerRoutes from "./routes/bannerRoute.js";
import cors from "cors";

dotenv.config();

// Connect to MongoDB (cached across serverless invocations — see config/db.js)
connectdb();

const app = express();

// ---- middleware ----
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ---- routes ----
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutees);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/banner", bannerRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the e-commerce app</h1>");
});

// LOCAL: start a normal server. VERCEL: skip listen(), export the app instead.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(
      `Server Running on ${process.env.DEV_MODE || "development"} mode on port ${PORT}`
        .bgCyan.white
    );
  });
}

export default app;