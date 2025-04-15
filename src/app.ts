// src/server.ts
import Fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';

// routes app
import {connectorsRoutes} from './api/routes/connector.routes';

const swaggerOptions = {
    openapi: {
      info: {
        title: 'Goemon Adapter',
        description: 'API endpoints for interacting with various trading protocols and DEX',
        version: '1.0.0'
      }
    }
}

const configureServer = () => {
    const server = Fastify({
        logger: true,
      });

  // Register Swagger
  server.register(fastifySwagger, swaggerOptions);

  // Register app routes
  server.register(connectorsRoutes, {prefix : '/connectors'})

  return server
}

export async function startServer() {
  const server = configureServer()

  try {
    await server.listen({ port: 8000 });
    console.log('🚀 Server running at http://localhost:8000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}
