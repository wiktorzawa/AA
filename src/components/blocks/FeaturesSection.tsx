import type { FC } from "react";
import { Card } from "flowbite-react";
import { HiCheckCircle, HiClock, HiShieldCheck, HiStar } from "react-icons/hi";

const FeaturesSection: FC = function () {
  const features = [
    {
      icon: HiCheckCircle,
      title: "99.9% uptime",
      description: "For Flowbite, with zero maintenance downtime",
    },
    {
      icon: HiShieldCheck,
      title: "600M+ Users",
      description: "Trusted by over 600 million users around the world",
    },
    {
      icon: HiClock,
      title: "100+ countries",
      description: "Have used Flowbite to create functional websites",
    },
    {
      icon: HiStar,
      title: "5+ Million",
      description: "Transactions per day",
    },
  ];

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
        <div className="mb-8 max-w-screen-md lg:mb-16">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Designed for business teams like yours
          </h2>
          <p className="text-gray-500 sm:text-xl dark:text-gray-400">
            Here at Flowbite we focus on markets where technology, innovation,
            and capital can unlock long-term value and drive economic growth.
          </p>
        </div>
        <div className="space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full lg:h-12 lg:w-12">
                <feature.icon className="text-primary-600 dark:text-primary-300 h-5 w-5 lg:h-6 lg:w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
