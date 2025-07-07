// Plik: src/controllers/productController.ts

import { Request, Response } from "express";
import Product from "../models/deliveries/DostDostawyProdukty"; // Upewnij się, że ścieżka do modelu Product jest poprawna!
import { Op } from "sequelize";
import { logger } from "../utils/logger";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    // Pobieramy parametry paginacji i wyszukiwania z zapytania URL
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const searchTerm = (req.query.search as string) || "";
    const offset = (page - 1) * limit;

    // Przygotowujemy warunki wyszukiwania
    const whereClause = searchTerm
      ? {
          nazwa_produktu: {
            [Op.iLike]: `%${searchTerm}%`, // iLike dla wyszukiwania bez względu na wielkość liter (PostgreSQL)
          },
        }
      : {};

    // Używamy metody findAndCountAll z Sequelize, która jest idealna do paginacji
    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: [["nazwa_produktu", "ASC"]], // Sortujemy alfabetycznie
    });

    const totalPages = Math.ceil(count / limit);

    // Zwracamy odpowiedź w formacie, którego oczekuje frontend
    return res.status(200).json({
      success: true,
      data: {
        products: rows,
        paginationInfo: {
          totalItems: count,
          totalPages: totalPages,
          currentPage: page,
        },
      },
    });
  } catch (error) {
    logger.error("Błąd w kontrolerze getAllProducts:", { error });
    return res
      .status(500)
      .json({ success: false, message: "Wystąpił błąd serwera." });
  }
};
