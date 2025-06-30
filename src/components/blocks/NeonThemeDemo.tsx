import type { FC } from "react";
import { Button, Card, Badge, Alert } from "flowbite-react";
import { HiSparkles, HiLightningBolt, HiStar } from "react-icons/hi";
import { neonTheme } from "../../theme/custom-theme";

export const NeonThemeDemo: FC = () => {
  return (
    <div className="dark:neon-bg min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white">
            <span className="glow-text-cyan neon-pulse">Neon</span>{" "}
            <span className="glow-text-magenta">Dark</span>{" "}
            <span className="glow-text-green">Theme</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Doświadcz futurystycznego designu z neonowymi akcentami
          </p>
        </div>

        {/* Neon Buttons */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="dark:neon-card">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-cyan-400">
              Neon Buttons
            </h3>
            <div className="space-y-3">
              <Button theme={neonTheme} color="primary" className="w-full">
                <HiSparkles className="mr-2 h-4 w-4" />
                Cyan Glow
              </Button>
              <Button theme={neonTheme} color="secondary" className="w-full">
                <HiLightningBolt className="mr-2 h-4 w-4" />
                Purple Magic
              </Button>
              <Button theme={neonTheme} color="accent" className="w-full">
                <HiStar className="mr-2 h-4 w-4" />
                Green Energy
              </Button>
            </div>
          </Card>

          <Card className="dark:neon-card">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-cyan-400">
              Neon Badges
            </h3>
            <div className="space-y-3">
              <Badge
                color="info"
                className="neon-border-cyan glow-text-cyan"
                size="lg"
              >
                Cyber Status
              </Badge>
              <Badge
                color="purple"
                className="neon-border-magenta glow-text-magenta"
                size="lg"
              >
                Neon Active
              </Badge>
              <Badge
                color="success"
                className="neon-border-green glow-text-green"
                size="lg"
              >
                Online
              </Badge>
            </div>
          </Card>

          <Card className="dark:neon-card">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-cyan-400">
              Neon Stats
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  CPU Usage
                </p>
                <p className="glow-text-cyan text-2xl font-bold">87%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Memory
                </p>
                <p className="glow-text-magenta text-2xl font-bold">4.2GB</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Network
                </p>
                <p className="glow-text-green text-2xl font-bold">↑ 1.2MB/s</p>
              </div>
            </div>
          </Card>

          <Card className="dark:neon-card">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-cyan-400">
              System Status
            </h3>
            <div className="space-y-3">
              <Alert color="info" className="neon-border-cyan">
                <span className="glow-text-cyan">System Online</span>
              </Alert>
              <Alert color="success" className="neon-border-green">
                <span className="glow-text-green">All Services Active</span>
              </Alert>
            </div>
          </Card>
        </div>

        {/* Interactive Elements */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card className="dark:neon-card">
            <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-cyan-400">
              Neon Interactive Panel
            </h3>
            <div className="space-y-4">
              <div className="neon-border-cyan rounded-lg p-4 dark:bg-gray-800/50">
                <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
                  Cyber Dashboard
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Monitoruj swoje systemy w czasie rzeczywistym z neonowymi
                  wskaźnikami.
                </p>
                <div className="mt-3 flex space-x-2">
                  <div className="neon-glow h-2 w-8 rounded bg-cyan-400"></div>
                  <div className="neon-glow h-2 w-12 rounded bg-fuchsia-500"></div>
                  <div className="neon-glow h-2 w-6 rounded bg-green-400"></div>
                </div>
              </div>

              <div className="neon-border-magenta rounded-lg p-4 dark:bg-gray-800/50">
                <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
                  Neural Network
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Zaawansowana analiza danych z AI i machine learning.
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="h-8 rounded bg-gradient-to-t from-fuchsia-500 to-purple-600 opacity-80"></div>
                  <div className="h-12 rounded bg-gradient-to-t from-fuchsia-500 to-purple-600 opacity-60"></div>
                  <div className="h-6 rounded bg-gradient-to-t from-fuchsia-500 to-purple-600 opacity-90"></div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="dark:neon-card">
            <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-cyan-400">
              Neon Controls
            </h3>
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Power Level
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="75"
                    className="slider-thumb-cyan h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                  />
                  <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>0%</span>
                    <span className="glow-text-cyan">75%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Frequency
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="45"
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                  />
                  <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Low</span>
                    <span className="glow-text-magenta">Medium</span>
                    <span>High</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  theme={neonTheme}
                  color="primary"
                  size="lg"
                  className="w-full"
                >
                  <HiSparkles className="mr-2 h-5 w-5" />
                  Activate Neon Mode
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 border-t border-gray-200 pt-8 text-center dark:border-cyan-500/20">
          <p className="text-gray-600 dark:text-gray-400">
            Neon Dark Theme - Futurystyczny design dla nowoczesnych aplikacji
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <span className="neon-glow inline-block h-3 w-3 rounded-full bg-cyan-400"></span>
            <span className="neon-glow inline-block h-3 w-3 rounded-full bg-fuchsia-500"></span>
            <span className="neon-glow inline-block h-3 w-3 rounded-full bg-green-400"></span>
          </div>
        </div>
      </div>
    </div>
  );
};
