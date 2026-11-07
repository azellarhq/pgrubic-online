import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), "");

  return {
    build: {
      rolldownOptions: {
        output: {
          strictExecutionOrder: true,
          codeSplitting: {
            groups: [
              {
                name: "monaco",
                test: /node_modules\/monaco-editor\//,
                // Rolldown measures this size before minification.
                maxSize: 1_000_000,
              },
            ],
          },
        },
      },
    },
    server: {
      ...(env.VITE_DEBUG === "true" && {
        proxy: {
          "/api": {
            target: "http://localhost:8000",
            changeOrigin: true,
            secure: false,
          },
        },
      }),
    },
  };
});
