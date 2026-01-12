/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPEN_WEATHER_BASE_URL: string;
  readonly VITE_OPEN_WEATHER_MAP_API_KEY: string;
  readonly VITE_VWORLD_API_KEY: string;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.css" {
  const content: string;
  export default content;
}
