import express from 'express';
import {authenticate} from '../middleware/auth.js';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controller/wishlistController.js';


const wishlistRouter = express.Router();


/**
 * @swagger
 * /wishlist/{productId}:
 *   post:
 *     summary: Add product to wishlist
 *     description: Adds a product to the authenticated user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the product to add to wishlist
 *     responses:
 *       201:
 *         description: Product added to wishlist successfully
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
 *                   example: "Product added to wishlist successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "9dbe62c4-7001-457b-9dd7-cc29be8a1a90"
 *       200:
 *         description: Product already exists in wishlist
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
 *                   example: "Product already in wishlist"
 *                 data:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "9dbe62c4-7001-457b-9dd7-cc29be8a1a90"
 *       400:
 *         description: Invalid product ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid product ID format"
 *                 data:
 *                   type: null
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 *                 data:
 *                   type: null
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to add product to wishlist"
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: "Error details in development"
 *                 data:
 *                   type: null
 */
wishlistRouter.post('/:productId', authenticate, addToWishlist);



/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Get user's wishlist
 *     description: Retrieves the authenticated user's wishlist with paginated products
 *     tags: [Wishlist]
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
 *         description: Wishlist retrieved successfully
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
 *                   example: "Wishlist retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "wishlist_123"
 *                     userId:
 *                       type: string
 *                       example: "user_123"
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/WishlistProduct'
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
 *     WishlistProduct:
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
 *           example: 299.99
 *         imageUrl:
 *           type: string
 *           example: "https://example.com/headphones.jpg"
 *         description:
 *           type: string
 *           example: "Noise cancelling wireless headphones"
 *         createdAt:
 *           type: string
 *           format: date-time
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
wishlistRouter.get('/', authenticate, getWishlist);

/**
 * @swagger
 * /wishlist/{productId}:
 *   delete:
 *     summary: Remove product from wishlist
 *     description: Removes a specific product from the authenticated user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "9dbe62c4-7001-457b-9dd7-cc29be8a1a90"
 *         description: ID of the product to remove from wishlist
 *     responses:
 *       200:
 *         description: Product successfully removed from wishlist
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
 *                   example: "Product removed from wishlist"
 *                 data:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "9dbe62c4-7001-457b-9dd7-cc29be8a1a90"
 *                     remainingItems:
 *                       type: integer
 *                       example: 2
 *       404:
 *         description: Not found (wishlist or product not found)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/WishlistNotFoundError'
 *                 - $ref: '#/components/schemas/ProductNotInWishlistError'
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     WishlistNotFoundError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Wishlist not found"
 *         data:
 *           type: null
 * 
 *     ProductNotInWishlistError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Product not in wishlist"
 *         data:
 *           type: null
 * 
 *     ServerError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Error removing from wishlist"
 *         error:
 *           type: string
 *           nullable: true
 *           example: "Database connection error"
 *         data:
 *           type: null
 */
wishlistRouter.delete('/:productId', authenticate, removeFromWishlist);

export default wishlistRouter;