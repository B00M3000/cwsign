import { defineBackend } from '@aws-amplify/backend';
import { FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda';
import { stocksApi } from './stocks-api/resource';

const backend = defineBackend({ stocksApi });

// Expose the function as a public HTTPS endpoint with CORS
backend.stocksApi.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: { allowedOrigins: ['*'] },
});
