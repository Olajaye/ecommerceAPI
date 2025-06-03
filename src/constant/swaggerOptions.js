export const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Ecommerce application',
      contact: {
        name: 'Your Name',
        email: 'your.email@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      // You can add more servers (e.g., production) here
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        }
      },
      schemas: {
        RegisterUser: {
          type: 'object',
          required: ['username', 'email', 'role', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123'
            },
            name: {
              type: 'string',
              example: 'John'
            },
            role: {
              type: 'string',
              enum: ['ADMIN', 'USER'],
              example: 'USER'
            }
          }
        },
        LoginUser: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123'
            },
          }
        },
         User: {
          type: 'object',
          required: ['id', 'email', 'name', 'role'],
          properties: {
            id: {
              type: 'string',
              example: '60d21b4667d0d8992e610c84'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com'
            },
            name: {
              type: 'string',
              example: 'John Doe'
            },
            role: {
              type: 'string',
              enum: ['ADMIN', 'USER'],
              example: 'USER'
            },

            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-10-01T12:00:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-10-01T12:00:00Z'
            }
          }
        },

        ProductInput:{
          type: 'object',
          required: ['name', 'description', 'price', 'stock', 'imageUrl'],
          properties: {
            name: {
              type: 'string',
              example: 'Sample Product'
            },
            description: {
              type: 'string',
              example: 'This is a sample product description.'
            },
            price: {
              type: 'number',
              format: 'float',
              example: 19.99
            },
            stock: {
              type: 'integer',
              example: 100
            },
            imageUrl: {
              type: 'string',
              format: 'uri',
              example: 'http://example.com/image.jpg'
            }
          }
        },
  
        Product: {
          type: 'object',
          required: ['name', 'description', 'price', 'stock', 'imageUrl'],
          properties: {
            id: {
              type: 'string',
              example: '60d21b4667d0d8992e610c85'
            },
            name: {
              type: 'string',
              example: 'Sample Product'
            },
            description: {
              type: 'string',
              example: 'This is a sample product description.'
            },

            price: {
              type: 'number',
              format: 'float',
              example: 19.99
            },
            stock: {
              type: 'integer',
              example: 100
            },
            imageUrl: {
              type: 'string',
              format: 'uri',
              example: 'http://example.com/image.jpg'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-10-01T12:00:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-10-01T12:00:00Z'
            }
          }
        },
        User: {
          type: 'object',
          required: ['id', 'email', 'name', 'role'],
          properties: {
            id: {
              type: 'string',
              example: '60d21b4667d0d8992e610c84'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com'
            },
            name: {
              type: 'string',
              example: 'John Doe'
            },
            role: {
              type: 'string',
              enum: ['ADMIN', 'USER'],
              example: 'USER'
            },

            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-10-01T12:00:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-10-01T12:00:00Z'
            }
          }
        },
        Cart: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              example: '60d21b4667d0d8992e610c84'
            },
            productId: {
              type: 'string',
              example: '60d21b4667d0d8992e610c85'
            },
            quantity: {
              type: 'integer',
              minimum: 1,
              example: 2
            },
            product: {
              $ref: '#/components/schemas/Product'
            },
          }
        },
        PaginatedProducts: {
          type: "object",
          properties: {
            products: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Product'
              }
            },
            totalCount: {
              type: 'integer',
              example: 100
            },
            totalPages: {
              type: 'integer',
              example: 10
            },
            currentPage: {
              type: 'integer',
              example: 1
            }
          }
        },
        ProductUpdate: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'Updated Product Name'
            },
            description: {
              type: 'string',
              example: 'Updated product description.'
            },
            price: {
              type: 'number',
              format: 'float',
              example: 29.99
            },
            stock: {
              type: 'integer',
              example: 50
            },
            imageUrl: {
              type: 'string',
              format: 'uri',
              example: 'http://example.com/updated-image.jpg'
            }
          }
        },
        Order:{
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '60d21b4667d0d8992e610c86'
            },
            userId: {
              type: 'string',
              example: '60d21b4667d0d8992e610c84'
            },
            totalAmount: {
              type: 'number',
              format: 'float',
              example: 59.98
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-10-01T12:00:00Z'
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Cart'
              }
            }
          }
        },
        OrderItem:{
          type: 'object',
          properties: {
            productId: {
              type: 'string',
              example: '60d21b4667d0d8992e610c85'
            },
            quantity: {
              type: 'integer',
              minimum: 1,
              example: 2
            },
            price: {
              type: 'number',
              format: 'float',
              example: 19.99
            }
          }
        },
        EmptyCartError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Cannot place order: Cart is empty'
            },
            data: {
              type: 'null'
            }
          }
        },
        InsufficientStockError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Cannot place order: Insufficient stock for product'
            },
            data: {
              type: 'null'
            }
          }
        },
       

      }
 
    },
  },
  apis: ['./src/routes/*.js'], // Path to your route files with Swagger annotations
};