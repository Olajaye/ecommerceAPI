import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createProduct = async (req, res) => {
  const { name, description, price, stock, imageUrl } = req.body;
  if (!name || !price || !stock) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: name, price, and stock are mandatory',
      data: null
    });
  }

  try {
    const product = await prisma.product.create({
      data: { 
        name: name.trim(),
        description: description?.trim() || null, 
        price: parseFloat(price), 
        stock: parseInt(stock), 
        imageUrl: imageUrl?.trim() || null
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });

  } catch (error) {
    console.error('[Product Controller] Creation error:', error);

    // Handle specific Prisma errors
    let errorMessage = 'Failed to create product';
    let statusCode = 400;

    if (error.code === 'P2002') {
      errorMessage = 'Product with this name already exists';
    } else if (error.code === 'P2003') {
      errorMessage = 'Invalid data format or reference';
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      errorMessage = 'Invalid input data format';
    }

    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      data: null
    });
  }
};

export const listProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { minPrice, maxPrice, sortBy, sortOrder } = req.query;
  
  try {
    const where = {};
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    const orderBy = sortBy ? { [sortBy]: sortOrder || 'asc' } : undefined;

    // Get products with pagination and filtering
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        where,
        orderBy,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          stock: true,
          imageUrl: true,
          createdAt: true
        }
      }),
      prisma.product.count({ where })
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: products,
      meta: {
        pagination: {
          totalItems: totalCount,
          itemCount: products.length,
          itemsPerPage: limit,
          totalPages,
          currentPage: page,
          hasNextPage,
          hasPreviousPage
        },
        filters: {
          minPrice: minPrice ? parseFloat(minPrice) : undefined,
          maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
          sortBy,
          sortOrder
        }
      }
    });

  } catch (error) {
    console.error('[Product Controller] List error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      data: null,
      meta: null
    });
  }
};

export const getProduct = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      success: false,
      message: 'Product ID is required',
      data: null
    });
  }
  
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: product
    });

  } catch (error) {
    console.error('[Product Controller] Get error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      data: null
    });
  }
};

export const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { name, description, price, stock, imageUrl } = req.body;
  if (!productId) {
    return res.status(400).json({
      success: false,
      message: 'Product ID is required',
      data: null
    });
  }
  if (!name || !price || !stock) {
    return res.status(400).json({
      success: false,
      message: 'Name, price, and stock are required fields',
      data: null
    });
  }

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { 
        name: name.trim(),
        description: description?.trim() || null,
        price: parseFloat(price),
        stock: parseInt(stock),
        imageUrl: imageUrl?.trim() || null
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });

  } catch (error) {
    console.error('[Product Controller] Update error:', error);

    let statusCode = 400;
    let errorMessage = 'Failed to update product';

    if (error.code === 'P2025') {
      statusCode = 404;
      errorMessage = 'Product not found';
    } else if (error.code === 'P2002') {
      errorMessage = 'Product name already exists';
    }

    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      data: null
    });
  }
};

export const deleteProduct = async (req, res) => {
  const productId =req.params.id;
  if (!productId) {
    return res.status(400).json({
      success: false,
      message: 'Product ID is required',
      data: null
    });
  }
  try {
    await prisma.product.delete({
      where: { id: productId }
    });

    return res.status(204).json({
      success: true,
      message: 'Product deleted successfully',
      data: null
    });

  } catch (error) {
    console.error('[Product Controller] Delete error:', error);

    let statusCode = 400;
    let errorMessage = 'Failed to delete product';

    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      data: null
    });
  }
};

