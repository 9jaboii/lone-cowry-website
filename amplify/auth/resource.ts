import { defineAuth } from '@aws-amplify/backend';

/**
 * Cognito Authentication Configuration
 *
 * Features:
 * - Email + password login
 * - Email verification
 * - Password reset via email
 * - Strong password policy
 * - Optional MFA via authenticator app
 * - No self-registration (admin creates users)
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },

  // User attributes
  userAttributes: {
    email: {
      required: true,
      mutable: true,
    },
    preferredUsername: {
      required: false,
      mutable: true,
    },
  },

  // Strong password requirements
  passwordPolicy: {
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: false,
  },

  // Multi-factor authentication (optional for users)
  multifactor: {
    mode: 'OPTIONAL',
    totp: true, // Authenticator app (Google Authenticator, Authy)
    sms: false, // Disabled to avoid SMS costs
  },

  // Account recovery via email
  accountRecovery: 'EMAIL_ONLY',
});
