import React, { useState } from "react";
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { zaloguj, DaneLogowania } from "@api/authApi"; // Import funkcji API
import { useAuth } from "@/contexts/AuthContext";

const SignInPage: FC = function () {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const credentials: DaneLogowania = {
      username: email,
      password,
    };

    try {
      const data = await zaloguj(credentials);

      if (
        data.success &&
        data.userRole &&
        data.token &&
        data.refresh_token &&
        data.userId
      ) {
        // Użyj AuthContext do logowania
        const userData = {
          id_logowania: data.userId,
          id_uzytkownika: data.userId,
          adres_email: email,
          rola_uzytkownika: data.userRole,
        };

        login(data.token, data.refresh_token, userData);

        // Przekierowanie na podstawie roli
        switch (data.userRole) {
          case "admin":
            navigate("/admin");
            break;
          case "staff":
            navigate("/staff");
            break;
          case "supplier":
            navigate("/supplier");
            break;
          default:
            navigate("/");
            break;
        }
      } else {
        setError(
          data.error || "Błąd logowania. Sprawdź dane i spróbuj ponownie.",
        );
      }
    } catch (err) {
      setError("Problem z połączeniem do serwera. Spróbuj ponownie później.");
      console.error("Błąd logowania:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-6 sm:py-12 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-center">
        <a href="/">
          <img alt="MS-BOX Logo" src="/flowbite.svg" className="h-10" />
        </a>
      </div>
      <Card className="w-full max-w-md p-6">
        <h1 className="mb-6 text-center text-2xl font-bold dark:text-white">
          Zaloguj się do platformy
        </h1>
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-gray-800 dark:text-red-400">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
          <div>
            <Label htmlFor="email" className="mb-2 block text-sm font-medium">
              Twój email
            </Label>
            <TextInput
              id="email"
              name="email"
              placeholder="imie@firma.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Twoje hasło
            </Label>
            <TextInput
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-3">
              <Checkbox id="rememberMe" name="rememberMe" />
              <Label htmlFor="rememberMe">Zapamiętaj mnie</Label>
            </div>
            <a
              href="/authentication/forgot-password"
              className="text-primary-600 dark:text-primary-500 text-sm hover:underline"
            >
              Zapomniałeś hasła?
            </a>
          </div>
          <div className="mt-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logowanie..." : "Zaloguj się"}
            </Button>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Nie masz konta?&nbsp;
            <a
              href="/authentication/sign-up"
              className="text-primary-600 dark:text-primary-500 hover:underline"
            >
              Utwórz konto
            </a>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default SignInPage;
