import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user.id;

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: 'Product ID is required',
      data: null
    });
  }


  if (quantity < 1) {
    return res.status(400).json({
      success: false,
      message: 'Quantity must be at least 1',
      data: null
    });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Verify product exists
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { stock: true, name: true, price: true, imageUrl: true, description: true }
      });

      if (!product) {
        return res.status(400).json({
          success: false,
          message: 'Product not found',
          data: null
        });
      }

      // Check if product already in cart
      const existingItem = await tx.cartItem.findFirst({
        where: {
          productId,
          userId
        },
        select: { id: true, quantity: true }
      });

      if (existingItem) {
        return await tx.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
          include: {
            product: {
              select: {
                id: false,
                stock: true,
                name: true,
                price: true,
                imageUrl: true,
                description: true,
                createdAt: true
              }
            }
          }
        });
      }

      // Create new cart item
      return await tx.cartItem.create({
        data: {
          productId,
          quantity,
          userId
        },
        include: {
          product: {
            select: {
              id: false,
              stock: true,
              name: true,
              price: true,
              imageUrl: true,
              description: true,
              createdAt: true
            }
          }
        }
      });
    });

    return res.status(200).json({
      success: true,
      message: 'Product added to cart',
      data: result
    });

  } catch (error) {
    console.error('[Cart Controller] Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to add product to cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      data: null
    });
  }


  // return await prisma.$transaction(async (tx) => {

  //   const productToAdd = await tx.product.findUnique({
  //     where: { id: productId },
  //   });
  //   if (!productToAdd) {
  //     return res.status(404).json({ message: 'Product not found' });
  //   }

  //   const existingItem = await prisma.cartItem.findFirst({
  //     where: { productId:  productId },
  //   });

  //   if (existingItem) {
  //     await prisma.cartItem.update({
  //       where: { id: existingItem.id },
  //       data: { quantity: quantity ? existingItem.quantity + quantity : existingItem.quantity + 1 },
  //     });
  //   } 

  //   const cartItem = await prisma.cartItem.create({
  //     data: {
  //       productId: productId,
  //       quantity: quantity || 1,
  //       userId: userId,
  //     },
  //     include: { product: true },
  //   });

  //   console.log('Cart item created:', cartItem);

  //   res.json({ message: 'Product added to cart' });

  // })
};

export const viewCart = async (req, res) => {
  const userId = req.user.id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const [cartItems, totalItems] = await Promise.all([
      prisma.cartItem.findMany({
        where: { userId },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
              stock: true,
              description: true
            }
          }
        },
        skip,
        take: limit
      }),
      prisma.cartItem.count({ where: { userId } })
    ]);

    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return res.status(200).json({
      success: true,
      message: 'Cart retrieved successfully',
      data: {
        userId,
        items: cartItems,
        meta: {
          pagination: {
            totalItems,
            itemCount: cartItems.length,
            itemsPerPage: limit,
            totalPages,
            currentPage: page,
            hasNextPage,
            hasPreviousPage
          },
          summary: {
            totalValue: cartItems.reduce(
              (sum, item) => sum + (item.product.price * item.quantity),
              0
            )
          }
        }
      }
    });

  } catch (error) {
    console.error('[Cart Controller] View error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      data: null
    });
  }
};


export const removeFromCart = async (req, res) => {
  const { cartItemId } = req.params;
  const userId = req.user.id;


  if (!cartItemId) {
    return res.status(400).json({
      success: false,
      message: 'Product ID is required',
      data: null
    });
  }

  try {
    // Verify the product exists in the user's cart
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId
      }
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'CartItem not found in cart',
        data: null
      });
    }

    // Remove the item from cart
    await prisma.cartItem.delete({
      where: {
        id: cartItem.id
      }
    });

    return res.status(200).json({
      success: true,
      message: 'CartItem removed from cart',
      data: {
        removedcartItemId: cartItemId,
        remainingItems: await prisma.cartItem.count({ where: { userId } }),
        cartItem: await prisma.cartItem.findMany({
          where: { userId },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
                stock: true,
                description: true
              }
            }
          }
        })
      }
    });

  } catch (error) {
    console.error('[Cart Controller] Remove error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to remove cartItem from cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      data: null
    });
  }
};

export const updateCartQuantity = async (req, res) => {
  const { quantity } = req.body;
  const cartItemId = req.params.cartItemId;
  if (!cartItemId || !quantity) {
    return res.status(400).json({
      message: 'Cart item ID and quantity are required',
    });
  }
  if (quantity < 1) {
    return res.status(400).json({
      message: 'Quantity must be at least 1',
    });
  }
  const cart = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const updatedCart = await prisma.cartItem.update({
    where: { id: cartItemId, userId: req.user.id },
    // where: { id: cartItemId, userId: req.user.id },
    data: { quantity },
    include: {
      product: {
        select: {
          name: true,
          price: true,
          imageUrl: true,
          stock: true,
          description: true
        }
      }
    }
  });

  res.status(200).json({
    success: true,
    message: 'Cart quantity updated successfully',
    data: updatedCart
  });
};

