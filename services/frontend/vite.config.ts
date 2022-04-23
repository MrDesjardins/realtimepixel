import path from "path";
import { defineConfig, loadEnv } from "vite";
import solidPlugin from "vite-plugin-solid";

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
        clientPort: 3501, //Number(process.env.DOCKER_CLIENT_PORT_FORWARD)
      },
      port: 3000, //Number(process.env.CLIENT_PORT),
    },
  });
};
