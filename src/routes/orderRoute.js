import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { placeOrder, viewOrders } from '../controller/ordrController.js';


const orderRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Shopping Ordes management
 */


/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place order from cart
 *     description: Creates an order from the user's cart items and clears the cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Order placed successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request (empty cart or insufficient stock)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/EmptyCartError'
 *                 - $ref: '#/components/schemas/InsufficientStockError'
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */
orderRouter.post('/', authenticate, placeOrder);



/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get user's orders (paginated)
 *     description: Retrieves paginated list of orders for the authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Orders retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     orders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/OrderWithItems'
 *                     meta:
 *                       $ref: '#/components/schemas/PaginationMeta'
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     OrderWithItems:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "order_123"
 *         status:
 *           type: string
 *           example: "COMPLETED"
 *         total:
 *           type: number
 *           format: float
 *           example: 149.97
 *         createdAt:
 *           type: string
 *           format: date-time
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItemWithProduct'
 * 
 *     OrderItemWithProduct:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "order_item_123"
 *         quantity:
 *           type: integer
 *           example: 2
 *         price:
 *           type: number
 *           format: float
 *           example: 49.99
 *         product:
 *           $ref: '#/components/schemas/ProductBasic'
 * 
 *     ProductBasic:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "prod_123"
 *         name:
 *           type: string
 *           example: "Premium Headphones"
 *         price:
 *           type: number
 *           format: float
 *           example: 49.99
 *         imageUrl:
 *           type: string
 *           example: "https://example.com/headphones.jpg"
 * 
 *     PaginationMeta:
 *       type: object
 *       properties:
 *         pagination:
 *           type: object
 *           properties:
 *             totalItems:
 *               type: integer
 *               example: 15
 *             itemCount:
 *               type: integer
 *               example: 5
 *             itemsPerPage:
 *               type: integer
 *               example: 5
 *             totalPages:
 *               type: integer
 *               example: 3
 *             currentPage:
 *               type: integer
 *               example: 2
 *             hasNextPage:
 *               type: boolean
 *               example: true
 *             hasPreviousPage:
 *               type: boolean
 *               example: true
 */
orderRouter.get('/', authenticate, viewOrders);

export default orderRouter;