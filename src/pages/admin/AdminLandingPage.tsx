import type { FC } from "react";
import { Button, Card } from "flowbite-react";
import { HiUsers, HiCog, HiChartPie, HiShieldCheck } from "react-icons/hi";
import { BlockBreadcrumb } from "@/components/block-breadcrumb";

const AdminLandingPage: FC = function () {
  return (
    <>
      <BlockBreadcrumb
        title="Landing Page"
        description="Welcome to the admin dashboard."
      />
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="text-center">
            <HiUsers className="mx-auto h-12 w-12 text-gray-400" />
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Manage Users
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Add, edit, and remove users from the system.
            </p>
            <Button>Go to users</Button>
          </Card>
          <Card className="text-center">
            <HiCog className="mx-auto h-12 w-12 text-gray-400" />
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Settings
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Configure application settings and preferences.
            </p>
            <Button>Go to settings</Button>
          </Card>
          <Card className="text-center">
            <HiChartPie className="mx-auto h-12 w-12 text-gray-400" />
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Analytics
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              View reports and statistics about the application.
            </p>
            <Button>Go to analytics</Button>
          </Card>
          <Card className="text-center">
            <HiShieldCheck className="mx-auto h-12 w-12 text-gray-400" />
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Security
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Manage security settings and access control.
            </p>
            <Button>Go to security</Button>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminLandingPage;
