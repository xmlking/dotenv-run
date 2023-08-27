export * from "./env.js";
export * from "./plugin.js";

declare global {
  interface ImportMeta {
    env: ImportMetaEnv;
  }

  interface ImportMetaEnv {
    [key: string]: any;
  }
}
