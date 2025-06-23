import { Request, Response } from "express";
import * as authService from "../services/login_auth_data.service";
import asyncHandler from "express-async-handler";
import { LoginCredentials } from "../models/login_auth_data.model";
import pool from "../db"; // Import puli połączeń

/**
 * Obsługuje logowanie użytkownika
 */
export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    console.log("--- Otrzymano żądanie logowania ---");
    const { username, password } = req.body as LoginCredentials;

    if (!username || !password) {
      console.log("Logowanie odrzucone: brak nazwy użytkownika lub hasła.");
      res.status(400).json({
        success: false,
        error: "Nazwa użytkownika i hasło są wymagane",
      });
      return;
    }
    console.log(`Próba logowania dla użytkownika: ${username}`);

    let connection;
    try {
      console.log("Nawiązywanie połączenia z pulą...");
      connection = await pool.getConnection();
      await connection.beginTransaction();
      console.log("Połączenie nawiązane, transakcja rozpoczęta.");

      // Pobierz dane użytkownika
      const user = await authService.getAuthDataByEmail(username, connection);

      if (!user) {
        console.log(`Użytkownik '${username}' nie został znaleziony.`);
        await connection.commit(); // Zatwierdź transakcję, mimo że użytkownika nie ma
        res
          .status(401)
          .json({ success: false, error: "Nieprawidłowe dane logowania" });
        return;
      }
      console.log(`Znaleziono użytkownika: ${user.email}, rola: ${user.role}`);

      // Sprawdź, czy konto jest zablokowane
      if (user.locked_until && new Date(user.locked_until) > new Date()) {
        console.log(
          `Konto użytkownika '${username}' jest zablokowane do ${new Date(user.locked_until).toLocaleString()}.`,
        );
        await connection.commit();
        res.status(401).json({
          success: false,
          error: `Konto jest tymczasowo zablokowane. Spróbuj ponownie po ${new Date(
            user.locked_until,
          ).toLocaleString()}`,
        });
        return;
      }

      // Weryfikacja hasła
      console.log("Weryfikacja hasła...");
      const isMatch = await authService.verifyPassword(
        password,
        user.password_hash,
      );
      console.log(`Wynik weryfikacji hasła: ${isMatch}`);

      if (isMatch) {
        // Resetuj licznik nieudanych logowań i aktualizuj datę ostatniego logowania
        console.log("Hasło poprawne. Aktualizowanie danych logowania...");
        await authService.resetFailedLoginAttempts(user.id_login, connection);
        await authService.updateLastLogin(user.id_login, connection);

        await connection.commit(); // Zatwierdź zmiany
        console.log("Transakcja zatwierdzona. Logowanie pomyślne.");

        res.json({
          success: true,
          userRole: user.role,
          userId: user.related_id,
        });
      } else {
        console.log("Nieprawidłowe hasło.");
        // Tutaj można dodać logikę inkrementacji nieudanych prób i blokowania konta
        await connection.commit();
        res
          .status(401)
          .json({ success: false, error: "Nieprawidłowe dane logowania" });
      }
    } catch (error) {
      if (connection) await connection.rollback(); // Wycofaj zmiany w razie błędu
      console.error("Błąd podczas logowania:", error);
      res
        .status(500)
        .json({ success: false, error: "Błąd serwera podczas logowania" });
    } finally {
      if (connection) {
        connection.release(); // Zawsze zwalniaj połączenie
        console.log("Połączenie zwolnione.");
      }
    }
  },
);
