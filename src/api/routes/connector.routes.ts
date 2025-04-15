import { FastifyPluginAsync } from 'fastify';
import { Type, Static } from '@sinclair/typebox';


const ConnectorSchema = Type.Object({
  name: Type.String(),
  protocols: Type.Array(Type.String()),
});

const ConnectorsResponseSchema = Type.Object({
  connectors: Type.Array(ConnectorSchema)
});

// Type for TypeScript
type ConnectorsResponse = Static<typeof ConnectorsResponseSchema>;

export const connectorsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Reply: ConnectorsResponse }>(
    '/',
    {
      schema: {
        description: 'Returns a list of connectors and their available protocols',
        tags: ['connectors'],
        response: {
          200: ConnectorsResponseSchema
        }
      }
    },
    async () => {
      
      const connectors = [
        {
          name: 'yield',
          protocols: ['pendle'],
        }
      ];

      return { connectors };
    }
  );
};
