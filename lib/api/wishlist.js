export async function getWishlist() {
  const response = await fetch('/api/wishlist');
  const data = await response.json();
 
  if (response.status === 401) return [];
  if (!response.ok) throw new Error(data.error);
 
  return data.wishlist;
}
 
export async function addToWishlist(productId) {
  const response = await fetch('/api/wishlist/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId }),
  });
 
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
 
  return data.item;
}
 
export async function removeFromWishlist(wishlistId) {
  const response = await fetch(`/api/wishlist/${wishlistId}`, {
    method: 'DELETE',
  });
 
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
 
  return data;
}
 
export async function isInWishlist(productId) {
  const wishlist = await getWishlist();
  return wishlist.some(item => item.product_id === productId);
}
 