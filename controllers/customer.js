
import { customers } from "../data/customers.js";

export const getCustomers = (req, res) => {
  res.json(customers);
};

export const getOverdueCustomers = (req,res) =>{
  const overdue = customers.filter((c) =>c.daysLate > 7 && c.due > 0);
  res.json(overdue);
};