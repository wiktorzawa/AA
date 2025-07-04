import type { FC, FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Checkbox,
  Label,
  Spinner,
  TextInput,
} from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { zaloguj } from "../../api/authApi";
import { useAuthStore } from "../../stores/authStore";
import { logger } from "../../utils/logger";

const SignInBackgroundPage: FC = function () {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await zaloguj({ adres_email: email, haslo: password });

      logger.info("Login response:", response);

      // Sprawdź nowy format API
      if (
        response.success &&
        response.userRole &&
        response.token &&
        response.refresh_token &&
        response.userId
      ) {
        // Nowy format API
        const userData = {
          id_logowania: response.userId,
          id_uzytkownika: response.userId,
          adres_email: email,
          rola_uzytkownika: response.userRole,
        };

        login({
          user: userData,
          token: response.token,
          refreshToken: response.refresh_token,
        });

        // Przekierowanie na podstawie roli
        switch (response.userRole) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "staff":
            navigate("/staff/dashboard");
            break;
          case "supplier":
            navigate("/supplier/dashboard");
            break;
          default:
            navigate("/");
            break;
        }
      } else if (
        response.token &&
        response.refresh_token &&
        response.uzytkownik
      ) {
        // Stary format API
        login({
          user: response.uzytkownik,
          token: response.token,
          refreshToken: response.refresh_token,
        });

        // Przekierowanie na podstawie roli
        switch (response.uzytkownik.rola_uzytkownika) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "staff":
            navigate("/staff/dashboard");
            break;
          case "supplier":
            navigate("/supplier/dashboard");
            break;
          default:
            navigate("/");
            break;
        }
      } else {
        setError(
          response.error || "Błąd logowania. Sprawdź dane i spróbuj ponownie.",
        );
      }
    } catch (err: unknown) {
      logger.error("Błąd API logowania", { error: err });
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Błąd połączenia z serwerem. Spróbuj ponownie później.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-700/60 bg-[url('https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/background.jpg')] bg-cover bg-center bg-no-repeat bg-blend-multiply">
      <div className="pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen">
        <div className="mb-6 flex items-center text-2xl font-semibold text-white">
          <img className="mr-2 h-8 w-8" src="/flowbite.svg" alt="logo" />
          MS-BOX Platform
        </div>
        <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:bg-gray-800">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6 lg:space-y-8">
            {error && (
              <Alert color="failure" icon={HiInformationCircle}>
                <span className="font-medium">Błąd logowania!</span> {error}
              </Alert>
            )}
            <h1 className="text-center text-xl leading-tight font-bold tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Zaloguj się do platformy
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email" className="mb-2 block dark:text-white">
                  Twój email
                </Label>
                <TextInput
                  id="email"
                  placeholder="imie@firma.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label
                  htmlFor="password"
                  className="mb-2 block dark:text-white"
                >
                  Twoje hasło
                </Label>
                <TextInput
                  id="password"
                  placeholder="••••••••"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <Checkbox
                      id="remember-background"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <Label
                      htmlFor="remember-background"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Zapamiętaj mnie
                    </Label>
                  </div>
                </div>
                <Link
                  to="/authentication/forgot-password"
                  className="text-primary-600 dark:text-primary-500 text-sm font-medium hover:underline"
                >
                  Zapomniałeś hasła?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Logowanie...</span>
                  </>
                ) : (
                  "Zaloguj się"
                )}
              </Button>
              <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                Nie masz konta?&nbsp;
                <Link
                  to="/authentication/sign-up"
                  className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
                >
                  Utwórz konto
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignInBackgroundPage;
