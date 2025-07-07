// Plik: src/routes/productRoutes.ts

import express from "express";
import { getAllProducts } from "../controllers/productController"; // Za chwilę stworzymy ten plik

const router = express.Router();

// Gdy przychodzi zapytanie GET na adres bazowy (którym będzie /products)
// wywołaj funkcję getAllProducts z kontrolera.
router.get("/", getAllProducts);

export default router;
