export const env = {
  demoMode: (process.env.NEXT_PUBLIC_DEMO_MODE ?? 'true') !== 'false',
  appName: 'Egypt One',
  tagline: 'One Egypt. One Journey. One Platform.',
  defaultLocale: 'en',
  mapProvider: process.env.NEXT_PUBLIC_MAP_PROVIDER ?? 'none',
  aiServiceUrl: process.env.AI_SERVICE_URL ?? '',
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? '',
} as const;
