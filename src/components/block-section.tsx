import type { FC, ReactNode } from "react";
import { Card } from "flowbite-react";

interface BlockSectionProps {
  title: string;
  description: string;
  githubLink?: string;
  children: ReactNode;
}

export const BlockSection: FC<BlockSectionProps> = ({
  title,
  description,
  githubLink,
  children,
}) => {
  return (
    <div className="mb-12">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
        {githubLink && (
          <a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 dark:text-primary-500 mt-2 inline-flex items-center text-sm hover:underline"
          >
            <svg
              className="mr-1 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            View on GitHub
          </a>
        )}
      </div>
      <Card className="overflow-hidden">{children}</Card>
    </div>
  );
};
