import express from 'express';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import * as dotenv from 'dotenv';
import productRoutes from './routes/productRoutes';

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Routes
app.use('/api/products', productRoutes);

// Define Swagger documentation
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'FMCG Commercial App API',
    version: '1.0.0',
    description: 'API documentation for FMCG Commercial App',
  },
  paths: {
    '/api/products': {
      get: {
        summary: 'Get list of products',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'category',
            schema: {
              type: 'string',
            },
            description: 'Filter products by category',
          },
          {
            in: 'query',
            name: 'priceBand',
            schema: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
            },
            description: 'Filter products by price band',
          },
          {
            in: 'query',
            name: 'name',
            schema: {
              type: 'string',
            },
            description: 'Filter products by name',
          },
          {
            in: 'query',
            name: 'page',
            schema: {
              type: 'integer',
            },
            description: 'Page number for pagination',
          },
          {
            in: 'query',
            name: 'limit',
            schema: {
              type: 'integer',
            },
            description: 'Number of items per page',
          },
        ],
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    products: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Product',
                      },
                    },
                    totalPages: {
                      type: 'integer',
                    },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden' },
        },
      },
      post: {
        summary: 'Create a new product',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Product',
              },
            },
          },
        },
        responses: {
          '201': { description: 'Product created' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden' },
        },
      },
    },
    '/api/products/{id}': {
      get: {
        summary: 'Get a product by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            schema: {
              type: 'string',
            },
            required: true,
            description: 'Product ID',
          },
        ],
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product',
                },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden' },
        },
      },
      put: {
        summary: 'Update a product',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            schema: {
              type: 'string',
            },
            required: true,
            description: 'Product ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Product',
              },
            },
          },
        },
        responses: {
          '200': { description: 'Product updated' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden' },
        },
      },
      delete: {
        summary: 'Delete a product',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            schema: {
              type: 'string',
            },
            required: true,
            description: 'Product ID',
          },
        ],
        responses: {
          '200': { description: 'Product deleted' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden' },
        },
      },
    },
  },
  components: {
    schemas: {
      Product: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          category: { type: 'string' },
          price: { type: 'number' },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
