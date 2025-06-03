
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {addToCart, viewCart, removeFromCart, updateCartQuantity} from '../controller/cathController.js';


const cathRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add product to cart
 *     description: Adds a product to the user's cart or updates quantity if already exists
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "60d21b4667d0d8992e610c85"
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       200:
 *         description: Product successfully added to cart
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
 *                   example: "Product added to cart"
 *                 data:
 *                   $ref: '#/components/schemas/Cart'           
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

// In your routes file:
cathRouter.post('/', authenticate, addToCart);

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user's shopping cart
 *     description: Retrieve all items in the authenticated user's shopping cart
 *     tags: [Cart]
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
 *         description: Successfully retrieved cart items
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
 *                   example: "User cart retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */
cathRouter.get('/', authenticate, viewCart);

/**
 * @swagger
 * /cart/{cartItemId}:
 *   delete:
 *     summary: Remove product from cart
 *     description: Remove a specific product from the authenticated user's shopping cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the cartItem to remove from cart
 *     responses:
 *       200:
 *         description: Product successfully removed from cart
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
 *                   example: "CartItem removed from cart"
 *                 remainingItems:
 *                   type: integer
 *                   example: 3
 *                   description: Number of items remaining in cart
 *       400:
 *         description: Invalid product ID
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Product not found in cart
 *       500:
 *         description: Server error
 */
cathRouter.delete('/:cartItemId', authenticate, removeFromCart);


/**
 * @swagger
 * /cart/{cartItemId}:
 *   put:
 *     summary: Update product quantity in cart
 *     description: Update the quantity of a specific product in the authenticated user's shopping cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to update in cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *                 description: New quantity for the product
 *     responses:
 *       200:
 *         description: Product quantity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product quantity updated"
 *                 cartItem:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c87"
 *                     productId:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c88"
 *                     quantity:
 *                       type: integer
 *                       example: 3
 *       400:
 *         description: Invalid input (quantity < 1 or invalid product ID)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Product not found in cart
 *       500:
 *         description: Server error
 */
cathRouter.put('/:cartItemId', authenticate, updateCartQuantity);

export default cathRouter;