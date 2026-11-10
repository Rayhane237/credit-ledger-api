import { analyzeBook } from "../services/analyze.js";

export const analyzeCustomers = async (req,res) =>{
    try{
        const result = await analyzeBook();
        res.json(result);
    }catch (err){
      console.error(err);
      res.status(502).json({ message: "L'analyse a échoué. Réessayez dans un instant." });
  }

}