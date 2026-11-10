import express from "express";
import { getCustomers ,getOverdueCustomers} from "../controllers/customer.js";

const router = express.Router();

router.get("/", getCustomers);
router.get("/overdue", getOverdueCustomers);

export default router;