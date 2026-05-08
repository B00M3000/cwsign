import { defineFunction } from '@aws-amplify/backend';

export const stocksApi = defineFunction({
  name: 'stocks-api',
  entry: './handler.ts',
  timeoutSeconds: 30,
  runtime: 20,
});
