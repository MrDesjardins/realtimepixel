import path from "path";
import { defineConfig, loadEnv } from "vite";
import solidPlugin from "vite-plugin-solid";
import { ENV_VARIABLES } from "./src/generated/constants_env";
export default (conf: any) => {
  process.env = { ...process.env, ...loadEnv(conf.mode, process.cwd(), "") };
  console.log(process.env);
  return defineConfig({
    plugins: [solidPlugin()],
    resolve: {
      alias: [{ find: "@shared", replacement: path.resolve(__dirname, "../shared") }],
    },
    build: {
      target: "esnext",
      polyfillDynamicImport: false,
    },
    server: {
      host: "0.0.0.0",
      hmr: {
        clientPort: ENV_VARIABLES.OUTER_PORT_FRONTEND, // 3501, //Number(process.env.OUTER_PORT_FRONTEND)
      },
      port: ENV_VARIABLES.INNER_PORT_FRONTEND_DEV, //Number(process.env.INNER_PORT_FRONTEND_DEV),
      watch: {
        usePolling: true,
      },
    },
  });
};
