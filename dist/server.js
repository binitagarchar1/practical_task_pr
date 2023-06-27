"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const dotenv = __importStar(require("dotenv"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
dotenv.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Connect to MongoDB
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp');
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// Routes
app.use('/api/products', productRoutes_1.default);
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
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
