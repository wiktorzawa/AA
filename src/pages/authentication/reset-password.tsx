/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Card, Label, TextInput } from "flowbite-react";
import type { FC } from "react";
import { Link } from "react-router-dom";

const ResetPasswordPage: FC = function () {
  return (
    <div className="flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-12">
      <Link to="/" className="my-6 flex items-center gap-x-1 lg:my-0">
        <img alt="MS-BOX logo" src="/flowbite.svg" className="mr-3 h-10" />
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          MS-BOX Platform
        </span>
      </Link>
      <Card
        horizontal
        imgSrc="/images/authentication/reset-password.jpg"
        imgAlt=""
        className="w-full md:max-w-[1024px] md:[&>*]:w-full md:[&>*]:p-16 [&>img]:hidden md:[&>img]:w-96 md:[&>img]:p-0 lg:[&>img]:block"
      >
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold md:text-3xl dark:text-white">
            Zresetuj swoje hasło
          </h1>
          <Link
            to="/authentication/sign-in-background"
            className="text-primary-600 dark:text-primary-500 text-sm hover:underline"
          >
            Wróć do logowania
          </Link>
        </div>
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
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="newPassword">Nowe hasło</Label>
            <TextInput
              id="newPassword"
              name="newPassword"
              placeholder="••••••••"
              type="password"
            />
          </div>
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="confirmNewPassword">Potwierdź nowe hasło</Label>
            <TextInput
              id="confirmNewPassword"
              name="confirmNewPassword"
              placeholder="••••••••"
              type="password"
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

export default ResetPasswordPage;
