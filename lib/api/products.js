// lib/api/products.js
import { getAccessToken } from '@/lib/utils/getAccessToken';

/**
 * Get products (published or creator's products)
 */
export async function getProducts(options = {}) {
  const {
    page = 1,
    limit = 12,
    search = '',
    creatorOnly = false,
  } = options;

  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  if (search) params.append('search', search);
  if (creatorOnly) params.append('creator_only', 'true');

  try {
    const token = await getAccessToken();
    
    const response = await fetch(`/api/products?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error);
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Get creator's products only
 */
export async function getCreatorProducts(options = {}) {
  return getProducts({
    ...options,
    creatorOnly: true,
  });
}

/**
 * Get single product by slug
 */
export async function getProduct(slug) {
  try {
    const response = await fetch(`/api/products/${slug}`);
    const data = await response.json();

    if (!response.ok) throw new Error(data.error);
    return data.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

/**
 * Create a new product
 */
export async function createProduct(productData) {
  try {
    const token = await getAccessToken();

    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error);
    return data.product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

/**
 * Update a product
 */
export async function updateProduct(productId, updates) {
  try {
    const token = await getAccessToken();

    const response = await fetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error);
    return data.product;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(productId) {
  try {
    const token = await getAccessToken();

    const response = await fetch(`/api/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error);
    return data.success;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

/**
 * Search products
 */
export async function searchProducts(query, options = {}) {
  return getProducts({
    ...options,
    search: query,
  });
}

/**
 * Publish a product (change status from draft to published)
 */
export async function publishProduct(productId) {
  return updateProduct(productId, { status: 'published' });
}

/**
 * Unpublish a product (change status from published to draft)
 */
export async function unpublishProduct(productId) {
  return updateProduct(productId, { status: 'draft' });
}