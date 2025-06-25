import { Request, Response } from "express";
import * as supplierService from "../services/login_table_suppliers.service";
import asyncHandler from "express-async-handler";
import pool from "../db"; // Import puli połączeń

/**
 * Pobiera listę wszystkich dostawców
 */
export const getAllSuppliers = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const suppliersList = await supplierService.getAllSuppliers(connection);
      res.json(suppliersList);
    } catch (error) {
      console.error("Błąd podczas pobierania dostawców:", error);
      res.status(500).json({ error: "Błąd serwera" });
    } finally {
      if (connection) connection.release();
    }
  },
);

/**
 * Pobiera dostawcę na podstawie ID
 */
export const getSupplierById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    let connection;

    try {
      connection = await pool.getConnection();
      const supplier = await supplierService.getSupplierById(id, connection);

      if (!supplier) {
        res.status(404).json({ error: "Dostawca nie został znaleziony" });
        return;
      }

      res.json(supplier);
    } catch (error) {
      console.error(`Błąd podczas pobierania dostawcy o ID ${id}:`, error);
      res.status(500).json({ error: "Błąd serwera" });
    } finally {
      if (connection) connection.release();
    }
  },
);

/**
 * Tworzy nowego dostawcę z automatycznie wygenerowanym ID i hasłem
 */
export const createSupplierWithPassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    let connection;
    try {
      // Walidacja danych wejściowych
      const {
        company_name,
        first_name,
        last_name,
        nip,
        email,
        phone,
        website,
        address_street,
        address_building,
        address_apartment,
        address_city,
        address_postal_code,
        address_country,
      } = req.body;

      if (
        !company_name ||
        !first_name ||
        !last_name ||
        !nip ||
        !email ||
        !phone ||
        !address_street ||
        !address_building ||
        !address_city ||
        !address_postal_code ||
        !address_country
      ) {
        res
          .status(400)
          .json({ error: "Wszystkie wymagane pola muszą być wypełnione" });
        return;
      }

      connection = await pool.getConnection();
      await connection.beginTransaction();

      // Sprawdź, czy dostawca o tym NIP lub adresie email już istnieje
      const existingSupplierByNip = await supplierService.getSupplierByNip(
        nip,
        connection,
      );
      if (existingSupplierByNip) {
        await connection.rollback();
        res.status(409).json({ error: "Dostawca o podanym NIP już istnieje" });
        return;
      }

      const existingSupplierByEmail = await supplierService.getSupplierByEmail(
        email,
        connection,
      );
      if (existingSupplierByEmail) {
        await connection.rollback();
        res
          .status(409)
          .json({ error: "Dostawca o podanym adresie email już istnieje" });
        return;
      }

      // Utwórz nowego dostawcę z automatycznie wygenerowanym ID i hasłem
      const result = await supplierService.createSupplier(
        {
          company_name,
          first_name,
          last_name,
          nip,
          email,
          phone,
          website,
          address_street,
          address_building,
          address_apartment,
          address_city,
          address_postal_code,
          address_country,
        },
        connection,
      );

      await connection.commit();
      res.status(201).json(result);
    } catch (error) {
      if (connection) await connection.rollback();
      console.error("Błąd podczas tworzenia dostawcy:", error);
      res.status(500).json({ error: "Błąd serwera" });
    } finally {
      if (connection) connection.release();
    }
  },
);

/**
 * Tworzy nowego dostawcę (bez konta logowania)
 */
export const createSupplier = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    let connection;
    try {
      // Walidacja danych wejściowych
      const {
        company_name,
        first_name,
        last_name,
        nip,
        email,
        phone,
        website,
        address_street,
        address_building,
        address_apartment,
        address_city,
        address_postal_code,
        address_country,
      } = req.body;

      if (
        !company_name ||
        !first_name ||
        !last_name ||
        !nip ||
        !email ||
        !phone ||
        !address_street ||
        !address_building ||
        !address_city ||
        !address_postal_code ||
        !address_country
      ) {
        res
          .status(400)
          .json({ error: "Wszystkie wymagane pola muszą być wypełnione" });
        return;
      }

      connection = await pool.getConnection();
      await connection.beginTransaction();

      // Sprawdź, czy dostawca o tym NIP lub adresie email już istnieje
      const existingSupplierByNip = await supplierService.getSupplierByNip(
        nip,
        connection,
      );
      if (existingSupplierByNip) {
        await connection.rollback();
        res.status(409).json({ error: "Dostawca o podanym NIP już istnieje" });
        return;
      }

      const existingSupplierByEmail = await supplierService.getSupplierByEmail(
        email,
        connection,
      );
      if (existingSupplierByEmail) {
        await connection.rollback();
        res
          .status(409)
          .json({ error: "Dostawca o podanym adresie email już istnieje" });
        return;
      }

      // Utwórz nowego dostawcę
      const newSupplier = await supplierService.addSupplier(
        {
          company_name,
          first_name,
          last_name,
          nip,
          email,
          phone,
          website,
          address_street,
          address_building,
          address_apartment,
          address_city,
          address_postal_code,
          address_country,
        },
        connection,
      );

      await connection.commit();
      res.status(201).json(newSupplier);
    } catch (error) {
      if (connection) await connection.rollback();
      console.error("Błąd podczas tworzenia dostawcy:", error);
      res.status(500).json({ error: "Błąd serwera" });
    } finally {
      if (connection) connection.release();
    }
  },
);

/**
 * Aktualizuje dane dostawcy
 */
export const updateSupplier = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    let connection;

    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      // Sprawdź, czy dostawca istnieje
      const existingSupplier = await supplierService.getSupplierById(
        id,
        connection,
      );
      if (!existingSupplier) {
        await connection.rollback();
        res.status(404).json({ error: "Dostawca nie został znaleziony" });
        return;
      }

      // Walidacja danych wejściowych
      const {
        company_name,
        first_name,
        last_name,
        nip,
        email,
        phone,
        website,
        address_street,
        address_building,
        address_apartment,
        address_city,
        address_postal_code,
        address_country,
      } = req.body;

      // Jeśli zmieniamy NIP, sprawdź czy nowy NIP jest już używany
      if (nip && nip !== existingSupplier.nip) {
        const existingSupplierByNip = await supplierService.getSupplierByNip(
          nip,
          connection,
        );
        if (existingSupplierByNip && existingSupplierByNip.id_supplier !== id) {
          await connection.rollback();
          res
            .status(409)
            .json({ error: "Dostawca o podanym NIP już istnieje" });
          return;
        }
      }

      // Jeśli zmieniamy email, sprawdź czy nowy email jest już używany
      if (email && email !== existingSupplier.email) {
        const existingSupplierByEmail =
          await supplierService.getSupplierByEmail(email, connection);
        if (
          existingSupplierByEmail &&
          existingSupplierByEmail.id_supplier !== id
        ) {
          await connection.rollback();
          res
            .status(409)
            .json({ error: "Dostawca o podanym adresie email już istnieje" });
          return;
        }
      }

      // Aktualizuj dane dostawcy
      const success = await supplierService.updateSupplier(
        id,
        {
          company_name,
          first_name,
          last_name,
          nip,
          email,
          phone,
          website,
          address_street,
          address_building,
          address_apartment,
          address_city,
          address_postal_code,
          address_country,
        },
        connection,
      );

      if (success) {
        const updatedSupplier = await supplierService.getSupplierById(
          id,
          connection,
        );
        await connection.commit();
        res.json(updatedSupplier);
      } else {
        await connection.rollback();
        res.status(500).json({ error: "Nie udało się zaktualizować dostawcy" });
      }
    } catch (error) {
      if (connection) await connection.rollback();
      console.error(`Błąd podczas aktualizacji dostawcy o ID ${id}:`, error);
      res.status(500).json({ error: "Błąd serwera" });
    } finally {
      if (connection) connection.release();
    }
  },
);

/**
 * Usuwa dostawcę
 */
export const deleteSupplier = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // Dekoduj ID z parametru URL, ponieważ może zawierać znaki specjalne (np. /)
    const encodedId = req.params.id;
    const id = decodeURIComponent(encodedId);
    let connection;

    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      // Sprawdź, czy dostawca istnieje
      const existingSupplier = await supplierService.getSupplierById(
        id,
        connection,
      );
      if (!existingSupplier) {
        await connection.rollback();
        res.status(404).json({ error: "Dostawca nie został znaleziony" });
        return;
      }

      // Usuń dostawcę
      const deleted = await supplierService.deleteSupplier(id, connection);

      if (deleted) {
        await connection.commit();
        res.status(200).json({ message: "Dostawca został usunięty" });
      } else {
        await connection.rollback();
        res.status(500).json({ error: "Nie udało się usunąć dostawcy" });
      }
    } catch (error) {
      if (connection) await connection.rollback();
      console.error(`Błąd podczas usuwania dostawcy o ID ${id}:`, error);
      res.status(500).json({ error: "Błąd serwera" });
    } finally {
      if (connection) connection.release();
    }
  },
);

/**
 * Generuje ID dostawcy
 */
export const generateSupplierId = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    let connection;
    try {
      console.log("Generowanie ID dostawcy");
      connection = await pool.getConnection();
      const newId = await supplierService.generateSupplierId(connection);
      console.log(`Wygenerowane ID: ${newId}`);
      res.json({ id_supplier: newId });
    } catch (error) {
      console.error("Błąd podczas generowania ID dostawcy:", error);
      res.status(500).json({ error: "Błąd serwera" });
    } finally {
      if (connection) connection.release();
    }
  },
);
