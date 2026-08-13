import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:       'Kangqore OS API',
      version:     '1.0.0',
      description: 'Public API for the Kangqore Operating System. Authenticate with a Bearer token obtained from /api/auth/login or a programmatic API key from Settings → Developer.',
      contact: {
        name:  'Kangqore',
        email: 'kangqore@gmail.com',
      },
    },
    servers: [
      { url: '/api',    description: 'Admin / internal (JWT auth)' },
      { url: '/api/v1', description: 'Public v1 (API key auth)'    },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type:         'http',
          scheme:       'bearer',
          bearerFormat: 'JWT',
          description:  'JWT obtained from POST /api/auth/login',
        },
        apiKeyAuth: {
          type:        'http',
          scheme:      'bearer',
          description: 'Programmatic API key (kq_live_...) from Settings → Developer',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth',         description: 'Authentication and session management' },
      { name: 'Data Privacy', description: 'GDPR data export, audit log, and deletion requests' },
      { name: 'Developer',    description: 'Programmatic API key management' },
      { name: 'KIMMP',        description: 'AI intelligence and agent dispatch' },
      { name: 'AEGIS',        description: 'Governance, audit, and access control' },
      { name: 'v1/OIS',       description: 'Public v1 — Operational Intelligence Score' },
      { name: 'v1/Signals',   description: 'Public v1 — KIMMP signal ingestion' },
      { name: 'v1/Decisions', description: 'Public v1 — Strategic decision records' },
      { name: 'v1/Blueprints',description: 'Public v1 — Enterprise blueprint management' },
    ],
  },
  apis: [
    './src/routes/*.ts',
    './src/kangqore-immp/routes.ts',
    './src/kangqore-aegis/routes.ts',
    './src/v1/router.ts',
    // Overshadow Roadmap P6.3 — swagger-jsdoc doesn't follow imports, so
    // v1/router.ts mounting these sub-routers was never enough; their real
    // @openapi JSDoc blocks were silently excluded from the live spec.
    './src/v1/kimmpOps.ts',
    './src/v1/ontology.ts',
  ],
}

export const swaggerSpec = swaggerJsdoc(options)
