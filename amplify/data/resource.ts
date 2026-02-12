import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * DynamoDB Schema for Blog Posts
 */
const schema = a.schema({
  Post: a
    .model({
      slug: a.string().required(),
      title: a.string().required(),
      excerpt: a.string().required(),
      content: a.string().required(),
      category: a.enum([
        'ai_ml',
        'defense',
        'quantum',
        'data',
        'cybersecurity',
        'telecom',
      ]),
      categoryLabel: a.string(),
      status: a.enum(['draft', 'published', 'scheduled']),
      author: a.string(),
      authorId: a.string(),
      featuredImage: a.string(),
      publishedAt: a.datetime(),
      scheduledFor: a.datetime(),
      readTime: a.integer(),
      tags: a.string().array(),
      icon: a.string(),
      gradient: a.string(),
    })
    .secondaryIndexes((index) => [
      index('status').sortKeys(['publishedAt']).name('byStatus'),
      index('slug').name('bySlug'),
    ])
    .authorization((allow) => [
      // Admins can do everything
      allow.authenticated().to(['create', 'read', 'update', 'delete']),
      // Public can only read published posts
      allow.guest().to(['read']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
