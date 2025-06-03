import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const placeOrder = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const cart = await prisma.cartItem.findMany({
    where: { userId: req.user.id },
    include: { product: true },
  });
  if (!cart || cart.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );


  const order = await prisma.order.create({
    data: {
      userId: req.user.id,
      total: totalAmount, // Use 'total' to match schema
      status: 'PENDING',
      items: {
        create: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
    include: { items: true }, // Optional: include created items in response
  });

  await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
  res.json({ message: 'Order placed', orderId: order.id });
};


export const viewOrders = async (req, res) => {
  if (!req.user?.id) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: User not authenticated',
      data: null
    });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, totalOrders] = await Promise.all([
      prisma.order.findMany({
        where: { userId: req.user.id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  stock: true,
                  description: true,
                  imageUrl: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.order.count({ where: { userId: req.user.id } })
    ]);

    const totalPages = Math.ceil(totalOrders / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: {
        orders,
        meta: {
          pagination: {
            totalItems: totalOrders,
            itemCount: orders.length,
            itemsPerPage: limit,
            totalPages,
            currentPage: page,
            hasNextPage,
            hasPreviousPage
          }
        }
      }
    });

  } catch (error) {
    console.error('[Order Controller] View orders error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      data: null
    });
  }
};

