export async function getProducts(options = {}) {
  const {
    page = 1,
    limit = 12,
    search = '',
    category = '',
    sortBy = 'created_at',
    order = 'desc',
  } = options;
 
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  if (sortBy) params.append('sortBy', sortBy);
  if (order) params.append('order', order);
 
  const response = await fetch(`/api/products?${params.toString()}`);
  const data = await response.json();
 
  if (!response.ok) throw new Error(data.error);
  return data;
}
 
export async function getProduct(slug) {
  const response = await fetch(`/api/products/${slug}`);
  const data = await response.json();
 
  if (!response.ok) throw new Error(data.error);
  return data.product;
}
 
export async function searchProducts(query) {
  const response = await fetch(
    `/api/products/search?q=${encodeURIComponent(query)}`
  );
  const data = await response.json();
 
  if (!response.ok) throw new Error(data.error);
  return data.products;
}