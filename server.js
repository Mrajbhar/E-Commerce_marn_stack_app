import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import connectdb from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutees from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRouters.js";
import cors from "cors";
import path from "path";

dotenv.config();

// database config
connectdb();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// =============================================================
// ONE-TIME INDEX CLEANUP
// Drops stale indexes on `products` then rebuilds from the schema.
// Run the server ONCE with this block, watch for the DONE line,
// then DELETE this whole block and restart.
// =============================================================
mongoose.connection.once("open", async () => {
  try {
    const productsCol = mongoose.connection.collection("products");

    const before = await productsCol.indexes();
    console.log("[index-cleanup] existing indexes on products:");
    console.log(before.map((i) => i.name));

    for (const idx of before) {
      if (idx.name === "_id_") continue;
      await productsCol.dropIndex(idx.name);
      console.log(`[index-cleanup] dropped: ${idx.name}`);
    }

    const productModel = mongoose.model("Products");
    await productModel.syncIndexes();
    console.log("[index-cleanup] rebuilt indexes from schema");

    const after = await productsCol.indexes();
    console.log("[index-cleanup] indexes are now:");
    console.log(after.map((i) => i.name));

    console.log("[index-cleanup] DONE — remove this block from server.js and restart.");
  } catch (err) {
    console.error("[index-cleanup] failed:", err);
  }
});
// =============================================================
// END OF ONE-TIME INDEX CLEANUP — DELETE EVERYTHING ABOVE AFTER FIRST SUCCESSFUL RUN
// =============================================================

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutees);
app.use("/api/v1/product", productRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the e-commerce app</h1>");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white
  );
});