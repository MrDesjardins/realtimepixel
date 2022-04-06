import { defineConfig, loadEnv } from "vite";
import solidPlugin from "vite-plugin-solid";

export default (conf: any) => {
  process.env = { ...process.env, ...loadEnv(conf.mode, process.cwd(), "") };
  console.log(process.env);
  return defineConfig({
    plugins: [solidPlugin()],
    build: {
      target: "esnext",
      polyfillDynamicImport: false,
    },
    server: {
      host: "0.0.0.0",
      port: 3000, //Number(process.env.CLIENT_PORT),
    },
  });
};
