"use client";

import { Request, Response } from "express";
import * as authService from "../services/login_auth_data.service";
import asyncHandler from "express-async-handler";
import { LoginCredentials } from "../models/login_auth_data.model";
import pool from "../db"; // Import puli połączeń

/**
 * Obsługuje logowanie użytkownika
 * Zaktualizowane do nowych nazw tabel z prefixami:
 * - auth_dane_autoryzacji (polskie nazwy kolumn)
 * - auth_historia_logowan (angielskie nazwy kolumn)
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

      // Pobierz dane użytkownika z tabeli auth_dane_autoryzacji (polskie kolumny)
      const user = await authService.getAuthDataByEmail(username, connection);

      if (!user) {
        console.log(`Użytkownik '${username}' nie został znaleziony.`);
        await connection.commit();
        res
          .status(401)
          .json({ success: false, error: "Nieprawidłowe dane logowania" });
        return;
      }
      console.log(
        `Znaleziono użytkownika: ${user.adres_email}, rola: ${user.rola_uzytkownika}`,
      );

      // Sprawdź liczbę nieudanych prób logowania (prosta blokada bez kolumny locked_until)
      const MAX_FAILED_ATTEMPTS = 5;
      if (user.nieudane_proby_logowania >= MAX_FAILED_ATTEMPTS) {
        console.log(
          `Konto użytkownika '${username}' jest zablokowane (${user.nieudane_proby_logowania} nieudanych prób).`,
        );

        // Zapisz nieudaną próbę do historii (tabela auth_historia_logowan - angielskie kolumny)
        await authService.logLoginAttempt(
          user.id_logowania,
          "failed",
          connection,
        );

        await connection.commit();
        res.status(401).json({
          success: false,
          error: `Konto jest tymczasowo zablokowane z powodu zbyt wielu nieudanych prób logowania. Skontaktuj się z administratorem.`,
        });
        return;
      }

      // Weryfikacja hasła
      console.log("Weryfikacja hasła...");
      const isMatch = await authService.verifyPassword(
        password,
        user.hash_hasla,
      );
      console.log(`Wynik weryfikacji hasła: ${isMatch}`);

      if (isMatch) {
        // Resetuj licznik nieudanych logowań i aktualizuj datę ostatniego logowania
        console.log("Hasło poprawne. Aktualizowanie danych logowania...");
        await authService.resetFailedLoginAttempts(
          user.id_logowania,
          connection,
        );
        await authService.updateLastLogin(user.id_logowania, connection);

        // Zapisz udaną próbę do historii
        await authService.logLoginAttempt(
          user.id_logowania,
          "success",
          connection,
        );

        await connection.commit(); // Zatwierdź zmiany
        console.log("Transakcja zatwierdzona. Logowanie pomyślne.");

        // Mapowanie do starych nazw dla kompatybilności z frontendem
        const legacyUser = authService.mapToLegacyFormat(user);

        res.json({
          success: true,
          userRole: legacyUser.role,
          userId: legacyUser.related_id,
        });
      } else {
        console.log(
          "Nieprawidłowe hasło. Zwiększanie licznika nieudanych prób...",
        );
        // Zwiększ licznik nieudanych prób logowania
        const failedAttempts = await authService.incrementFailedLoginAttempts(
          user.id_logowania,
          connection,
        );
        console.log(`Liczba nieudanych prób: ${failedAttempts}`);

        // Zapisz nieudaną próbę do historii
        await authService.logLoginAttempt(
          user.id_logowania,
          "failed",
          connection,
        );

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
