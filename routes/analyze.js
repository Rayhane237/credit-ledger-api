import express from "express";
import { analyzeCustomers } from "../controllers/analyze.js";

const router = express.Router();

router.post("/", analyzeCustomers);
export default router;