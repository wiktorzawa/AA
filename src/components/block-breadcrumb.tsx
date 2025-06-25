import type { FC } from "react";
import { Breadcrumb, BreadcrumbItem } from "flowbite-react";

interface BlockBreadcrumbProps {
  title: string;
  description: string;
}

export const BlockBreadcrumb: FC<BlockBreadcrumbProps> = ({
  title,
  description,
}) => {
  return (
    <div className="mb-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/blocks">Blocks</BreadcrumbItem>
        <BreadcrumbItem>{title}</BreadcrumbItem>
      </Breadcrumb>
      <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
        {title}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};
