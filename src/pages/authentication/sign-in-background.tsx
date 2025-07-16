import {
  Alert,
  Button,
  Checkbox,
  Label,
  Spinner,
  TextInput,
} from "flowbite-react";
import type { FC } from "react";
import { useState } from "react";
import { HiInformationCircle } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { zaloguj } from "@/api/authApi";
import { logger } from "@/utils/logger";

const SignInBackgroundPage: FC = function () {
  const [email, setEmail] = useState("admin@msbox.com");
  const [password, setPassword] = useState("admin");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await zaloguj({
        email: email,
        password: password,
      });

      if (result.success) {
        logger.info("Login successful, navigating to dashboard.", {
          user: result.user,
          appRole: result.appRole,
        });
        let target = "/";
        switch (result.appRole) {
          case "admin":
            target = "/admin/dashboard";
            break;
          case "staff":
            target = "/staff/dashboard";
            break;
          case "supplier":
            target = "/supplier/dashboard";
            break;
          default:
            target = "/";
        }
        navigate(target);
      } else {
        const errorMessage =
          typeof result.error === "string"
            ? result.error
            : result.error?.message || "Wystąpił nieznany błąd";
        setError(errorMessage);
        logger.error("Login failed:", { error: result.error });
      }
    } catch (err: any) {
      const errorMessage = err?.error?.message || err.message || "Błąd serwera";
      setError(errorMessage);
      logger.error("Login exception:", { error: err });
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
