import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const addToWishlist = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await prisma.wishlist.findUnique({ where: { userId: req.user.id } });
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: req.user.id },
      });
    }

    const existingProduct = await prisma.wishlist.findFirst({
      where: {
        id: wishlist.id,
        products: { some: { id: productId } },
      },
    });

    if (existingProduct) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    const addProduct = await prisma.wishlist.update({
      where: { id: wishlist.id },
      data: {
        products: { connect: { id: productId } },
      },
    });

    // res.json({ message: 'Product added to wishlist' });
    return res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      addProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding to wishlist' });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: req.user.id },
      include: { products: true },
    });

    if (!wishlist) {
      return res.json({ products: [] });
    }

    res.json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
};

export const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  try {
    const wishlist = await prisma.wishlist.findUnique({ where: { userId: req.user.id } });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    const hasProduct = await prisma.wishlist.findFirst({
      where: {
        id: wishlist.id,
        products: { some: { id: productId } },
      },
    });

    if (!hasProduct) {
      return res.status(404).json({ message: 'Product not in wishlist' });
    }

    // Remove product from wishlist
    await prisma.wishlist.update({
      where: { id: wishlist.id },
      data: {
        products: { disconnect: { id: productId } },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      data: {
        productId,
      }
    });
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing from wishlist' });
  }
};

