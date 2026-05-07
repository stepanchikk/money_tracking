const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance API',
      version: '1.0.0',
      description: 'Документація API для системи трекінгу фінансів',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Локальний сервер',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Шлях до файлів з анотаціями
};

const specs = swaggerJsDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpecs: specs,
};
