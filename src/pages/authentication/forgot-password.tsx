/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Card, Label, TextInput } from "flowbite-react";
import type { FC } from "react";
import { Link } from "react-router-dom";

const ForgotPasswordPage: FC = function () {
  return (
    <div className="flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-12">
      <Link to="/" className="my-6 flex items-center gap-x-1 lg:my-0">
        <img alt="MS-BOX logo" src="/flowbite.svg" className="mr-3 h-10" />
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          MS-BOX Platform
        </span>
      </Link>
      <Card className="w-full lg:max-w-[640px] lg:[&>*]:w-full lg:[&>*]:p-16">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold md:text-3xl dark:text-white">
            Zapomniałeś hasła?
          </h1>
          <Link
            to="/authentication/sign-in-background"
            className="text-primary-600 dark:text-primary-500 text-sm hover:underline"
          >
            Wróć do logowania
          </Link>
        </div>
        <p className="mb-3 text-gray-500 dark:text-gray-300">
          Nie martw się! Wpisz swój adres e-mail, a my wyślemy Ci kod do
          zresetowania hasła!
        </p>
        <form>
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="email">Twój email</Label>
            <TextInput
              id="email"
              name="email"
              placeholder="imie@firma.com"
              type="email"
            />
          </div>
          <div>
            <Button type="submit" className="w-full lg:w-auto">
              Zresetuj hasło
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
