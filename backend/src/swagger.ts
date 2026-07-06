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
      { url: '/api', description: 'Production' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type:   'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
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
    ],
  },
  apis: ['./src/routes/*.ts', './src/kangqore-immp/routes.ts', './src/kangqore-aegis/routes.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)
