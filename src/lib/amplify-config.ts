// AWS Amplify Configuration
// In production, Amplify Gen 2 auto-generates 'amplifyconfiguration.json'
// For local development without AWS, the app runs in demo mode

// Check if we're in demo mode (no Amplify configured)
export const isDemoMode = !process.env.NEXT_PUBLIC_AMPLIFY_CONFIGURED;

// This will be replaced by Amplify Gen 2 auto-generated config
export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || '',
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || '',
      loginWith: {
        email: true,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || '',
      defaultAuthMode: 'userPool' as const,
    },
  },
  Storage: {
    S3: {
      bucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET || '',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
    },
  },
};

// DynamoDB Table Names (used in demo mode)
export const TABLES = {
  POSTS: 'LoneCowryPosts',
  USERS: 'LoneCowryUsers',
};
