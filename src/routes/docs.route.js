import express from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const router = express.Router();

const options = {
  swaggerDefinition: {
    info: {
      title: "stark api",
      version: "1.0.0",
    }
  },
  apis: ['src/routes/*.js'],
};

const specs = swaggerJsDoc(options);

router.use(
  "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

export default router;