import { defineStorage } from '@aws-amplify/backend';

/**
 * S3 Storage Configuration for Blog Images
 */
export const storage = defineStorage({
  name: 'loneCowryMedia',
  access: (allow) => ({
    // Blog images - public read, authenticated write
    'blog-images/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    // Featured images
    'featured/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    // Admin uploads (private)
    'admin/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
    ],
  }),
});
