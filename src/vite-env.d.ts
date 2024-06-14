/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API: string;
  readonly MODE: "development" | "production";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
