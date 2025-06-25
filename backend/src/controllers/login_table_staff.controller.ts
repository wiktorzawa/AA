import { Request, Response } from "express";
import * as staffService from "../services/login_table_staff.service";
import asyncHandler from "express-async-handler";
import pool from "../db"; // Import puli połączeń

/**
 * Generuje ID pracownika na podstawie roli
 */
export const generateStaffId = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { role } = req.query;

    if (!role || (role !== "admin" && role !== "staff")) {
      res.status(400).json({
        error: 'Nieprawidłowa rola. Dozwolone wartości to "admin" lub "staff"',
      });
      return;
    }

    let connection;
    try {
      console.log(`Generowanie ID dla roli: ${role}`);
      connection = await pool.getConnection();
      const newId = await staffService.generateStaffId(
        role as "admin" | "staff",
        connection,
      );
      console.log(`Wygenerowane ID: ${newId}`);
      res.json({ id_staff: newId });
    } catch (error) {
      console.error("Błąd podczas generowania ID pracownika:", error);
      res.status(500).json({ error: "Błąd serwera" });
    } finally {
      if (connection) connection.release();
    }
  },
);

/**
 * Tworzy nowego pracownika z automatycznie wygenerowanym ID i hasłem
 */
export const createStaffWithPassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    let connection;
    try {
      // Walidacja danych wejściowych
      const { first_name, last_name, role, email, phone } = req.body;

      if (!first_name || !last_name || !role || !email) {
        res
          .status(400)
          .json({ error: "Wszystkie wymagane pola muszą być wypełnione" });
        return;
      }

      if (role !== "admin" && role !== "staff") {
        res.status(400).json({
          error:
            'Nieprawidłowa rola. Dozwolone wartości to "admin" lub "staff"',
        });
        return;
      }

      connection = await pool.getConnection();
      await connection.beginTransaction();

      // Sprawdź, czy pracownik o tym adresie email już istnieje
      const existingStaffByEmail = await staffService.getStaffByEmail(
        email,
        connection,
      );
      if (existingStaffByEmail) {
        await connection.rollback();
        res
          .status(409)
          .json({ error: "Pracownik o podanym adresie email już istnieje" });
        return;
      }

      // Utwórz nowego pracownika z automatycznie wygenerowanym ID i hasłem
      const result = await staffService.createStaff(
        {
          first_name,
          last_name,
          role,
          email,
          phone,
        },
        connection,
      );

      await connection.commit();
      res.status(201).json(result);
    } catch (error) {
      if (connection) await connection.rollback();
      console.error("Błąd podczas tworzenia pracownika:", error);
      res.status(500).json({ error: "Błąd serwera" });
    } finally {
      if (connection) connection.release();
    }
  },
);

/**
 * Pobiera listę wszystkich pracowników
 */
export const getAllStaff = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    let connection;
    try {
      connection = await pool.getConnection();
      const staffList = await staffService.getAllStaff(connection);
      res.json(staffList);
    } catch (error) {
      console.error("Błąd podczas pobierania pracowników:", error);
      res.status(500).json({ error: "Błąd serwera" });
    } finally {
      if (connection) connection.release();
    }
  },
);

/**
 * Pobiera pracownika na podstawie ID
 */
export const getStaffById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    let connection;

    try {
      connection = await pool.getConnection();
      const staff = await staffService.getStaffById(id, connection);

      if (!staff) {
        res.status(404).json({ error: "Pracownik nie został znaleziony" });
        return;
      }

      res.json(staff);
    } catch (error) {
      console.error(`Błąd podczas pobierania pracownika o ID ${id}:`, error);
      res.status(500).json({ error: "Błąd serwera" });
    } finally {
      if (connection) connection.release();
    }
  },
);

/**
 * Tworzy nowego pracownika (bez konta logowania)
 */
export const createStaff = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    let connection;
    try {
      // Walidacja danych wejściowych
      const { first_name, last_name, role, email, phone } = req.body;

      if (!first_name || !last_name || !role || !email) {
        res
          .status(400)
          .json({ error: "Wszystkie wymagane pola muszą być wypełnione" });
        return;
      }

      connection = await pool.getConnection();
      await connection.beginTransaction();

      // Sprawdź, czy pracownik o tym adresie email już istnieje
      const existingStaffByEmail = await staffService.getStaffByEmail(
        email,
        connection,
      );
      if (existingStaffByEmail) {
        await connection.rollback();
        res
          .status(409)
          .json({ error: "Pracownik o podanym adresie email już istnieje" });
        return;
      }

      // Utwórz nowego pracownika
      const newStaff = await staffService.addStaff(
        {
          first_name,
          last_name,
          role,
          email,
          phone,
        },
        connection,
      );

      await connection.commit();
      res.status(201).json(newStaff);
    } catch (error) {
      if (connection) await connection.rollback();
      console.error("Błąd podczas tworzenia pracownika:", error);
      res.status(500).json({ error: "Błąd serwera" });
    } finally {
      if (connection) connection.release();
    }
  },
);

/**
 * Aktualizuje dane pracownika
 */
export const updateStaff = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    let connection;

    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      // Sprawdź, czy pracownik istnieje
      const existingStaff = await staffService.getStaffById(id, connection);
      if (!existingStaff) {
        await connection.rollback();
        res.status(404).json({ error: "Pracownik nie został znaleziony" });
        return;
      }

      // Walidacja danych wejściowych
      const { first_name, last_name, role, email, phone } = req.body;

      // Jeśli zmieniamy email, sprawdź czy nowy email jest już używany
      if (email && email !== existingStaff.email) {
        const existingStaffByEmail = await staffService.getStaffByEmail(
          email,
          connection,
        );
        if (existingStaffByEmail && existingStaffByEmail.id_staff !== id) {
          await connection.rollback();
          res
            .status(409)
            .json({ error: "Pracownik o podanym adresie email już istnieje" });
          return;
        }
      }

      // Aktualizuj dane pracownika
      const success = await staffService.updateStaff(
        id,
        {
          first_name,
          last_name,
          role,
          email,
          phone,
        },
        connection,
      );

      if (success) {
        const updatedStaff = await staffService.getStaffById(id, connection);
        await connection.commit();
        res.json(updatedStaff);
      } else {
        await connection.rollback();
        res
          .status(500)
          .json({ error: "Nie udało się zaktualizować pracownika" });
      }
    } catch (error) {
      if (connection) await connection.rollback();
      console.error(`Błąd podczas aktualizacji pracownika o ID ${id}:`, error);
      res.status(500).json({ error: "Błąd serwera" });
    } finally {
      if (connection) connection.release();
    }
  },
);

/**
 * Usuwa pracownika
 */
export const deleteStaff = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // Dekoduj ID z parametru URL, ponieważ może zawierać znaki specjalne (np. /)
    const encodedId = req.params.id;
    const id = decodeURIComponent(encodedId);
    let connection;

    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      // Sprawdź, czy pracownik istnieje
      const existingStaff = await staffService.getStaffById(id, connection);
      if (!existingStaff) {
        await connection.rollback();
        res.status(404).json({ error: "Pracownik nie został znaleziony" });
        return;
      }

      // Usuń pracownika
      const deleted = await staffService.deleteStaff(id, connection);

      if (deleted) {
        await connection.commit();
        res.status(200).json({ message: "Pracownik został usunięty" });
      } else {
        await connection.rollback();
        res.status(500).json({ error: "Nie udało się usunąć pracownika" });
      }
    } catch (error) {
      if (connection) await connection.rollback();
      console.error(`Błąd podczas usuwania pracownika o ID ${id}:`, error);
      res.status(500).json({ error: "Błąd serwera" });
    } finally {
      if (connection) connection.release();
    }
  },
);
