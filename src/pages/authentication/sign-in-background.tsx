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
import { zaloguj } from "../../api/login_auth_data.api";

const SignInBackgroundPage: FC = function () {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await zaloguj({ username: email, password });

      if (response.success && response.userRole) {
        // Zapisz rolę użytkownika w localStorage
        localStorage.setItem("userRole", response.userRole);

        // Przekierowanie na podstawie roli użytkownika
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
            // Domyślne przekierowanie, jeśli rola nie jest określona
            navigate("/");
            break;
        }
      } else {
        setError(response.error || "Wystąpił nieznany błąd.");
      }
    } catch (err) {
      console.error("Login API call failed:", err);
      setError("Błąd połączenia z serwerem. Spróbuj ponownie później.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-700/60 bg-[url('https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/background.jpg')] bg-cover bg-center bg-no-repeat bg-blend-multiply">
      <div className="pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen">
        <a
          href="#"
          className="mb-6 flex items-center text-2xl font-semibold text-white"
        >
          <img
            className="mr-2 h-8 w-8"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Your Brand
        </a>
        <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:bg-gray-800">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6 lg:space-y-8">
            {error && (
              <Alert color="failure" icon={HiInformationCircle}>
                <span className="font-medium">Błąd logowania!</span> {error}
              </Alert>
            )}
            <h1 className="text-center text-xl leading-tight font-bold tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email" className="mb-2 block dark:text-white">
                  Your email
                </Label>
                <TextInput
                  id="email"
                  placeholder="name@company.com"
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
                  Password
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
                      Remember me
                    </Label>
                  </div>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-primary-600 dark:text-primary-500 text-sm font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Logowanie...</span>
                  </>
                ) : (
                  "Log in to your account"
                )}
              </Button>
              <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                Don't have an account yet?&nbsp;
                <Link
                  to="/sign-up"
                  className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
                >
                  Sign up
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
