/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Card, Label, TextInput } from "flowbite-react";
import type { FC } from "react";
import { HiLockOpen } from "react-icons/hi";
import { Link } from "react-router-dom";

const ProfileLockPage: FC = function () {
  return (
    <div className="flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-12">
      <Link to="/" className="my-8 flex items-center gap-x-1 lg:my-0">
        <img alt="MS-BOX logo" src="/flowbite.svg" className="mr-3 h-10" />
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          MS-BOX Platform
        </span>
      </Link>
      <Card className="w-full md:max-w-[640px] md:[&>*]:w-full md:[&>*]:p-16">
        <h1 className="text-2xl font-bold md:text-3xl dark:text-white">
          Sesja zablokowana
        </h1>
        <p className="mb-3 text-gray-500 dark:text-gray-300">
          Wprowadź hasło, aby odblokować.
        </p>
        <form>
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="password">Twoje hasło</Label>
            <TextInput
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
            />
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit" className="lg:w-auto">
              <HiLockOpen className="mr-2 text-xl" />
              Odblokuj
            </Button>
            <Link
              to="/authentication/sign-in-background"
              className="text-primary-600 dark:text-primary-500 text-sm hover:underline"
            >
              To nie Ty? Zaloguj się
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProfileLockPage;
