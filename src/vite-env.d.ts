/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTENT_SOURCE?: 'local' | 'api' | 'mock-api';
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
