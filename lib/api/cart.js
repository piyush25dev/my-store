export async function getCart() {
  const response = await fetch('/api/cart');
  const data = await response.json();
 
  if (response.status === 401) return { cart: [], total: 0, itemCount: 0 };
  if (!response.ok) throw new Error(data.error);
 
  return data;
}
 
export async function addToCart(productId, quantity = 1, variantId = null) {
  const response = await fetch('/api/cart/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity, variantId }),
  });
 
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
 
  return data;
}
 
export async function removeFromCart(cartItemId) {
  const response = await fetch(`/api/cart/${cartItemId}`, {
    method: 'DELETE',
  });
 
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
 
  return data;
}
 
export async function updateCartQuantity(cartItemId, quantity) {
  // Implemented on backend as needed
  // For now, remove and re-add with new quantity
  await removeFromCart(cartItemId);
  // Get cart to find product and variant
  const cart = await getCart();
  const item = cart.cart.find(i => i.id === cartItemId);
  if (item) {
    await addToCart(item.product_id, quantity, item.variant_id);
  }
}
 
export async function clearCart() {
  const cart = await getCart();
  for (const item of cart.cart) {
    await removeFromCart(item.id);
  }
}