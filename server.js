import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import customerRoutes from "./routes/customer.js";
import authRoutes from "./routes/auth.js";
import analyzeRoutes from "./routes/analyze.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

//------------------- APIs routes------------------------------------
app.use("/api/customers", customerRoutes);
app.use("/api/login" , authRoutes);
app.use("/api/analyze", analyzeRoutes);


//------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});