import express from 'express';
import dotenv from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { options } from './src/constant/swaggerOptions.js';
import authRoutes from './src/routes/authRoute.js'
import productRouter from './src/routes/productRoute.js';
import cartRouter from './src/routes/cartRoute.js';
import orderRouter from './src/routes/orderRoute.js';
import wishlistRoutes from './src/routes/wishListRoute.js';

dotenv.config();

const app = express();

app.use(express.json());



const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', 
  swaggerUi.serve, 
  swaggerUi.setup(swaggerSpec, {
    explorer: true, // Enable search bar
    customSiteTitle: "Ecommerce API Docs",
    // customCss: '.swagger-ui .topbar { display: none }',
    // customfavIcon: '/public/favicon.ico'
  })
);




/**
 * @swagger
 * /
 *   get:
 *     summary: Welcome endpoint
 *     description: Returns a welcome message for the API
 *     tags: [General]
 *     responses:
 *       200:
 *         description: A welcome message
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Welcome to the API"
 */
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/products', productRouter); 
app.use('/cart', cartRouter);
app.use('/orders', orderRouter); 
app.use('/wishlist', wishlistRoutes); // Add this


// Error handling middleware (recommended to add)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});