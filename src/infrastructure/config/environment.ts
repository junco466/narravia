export type ContentSource = 'local' | 'api' | 'mock-api';

export const environment = {
  contentSource: (import.meta.env.VITE_CONTENT_SOURCE ?? 'local') as ContentSource,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
};
