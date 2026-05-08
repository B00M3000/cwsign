import { defineBackend } from '@aws-amplify/backend';
import { FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda';
import { stocksApi } from './functions/stocks-api/resource';

const backend = defineBackend({ stocksApi });

backend.stocksApi.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: { allowedOrigins: ['*'] },
});
