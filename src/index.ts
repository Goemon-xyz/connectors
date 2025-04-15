import { startServer } from "./app";

if (process.env.START_SERVER === 'true') {
  startServer().catch((err) => {
    console.error('Failed to start Fastify server:', err);
    process.exit(1);
  });
}
