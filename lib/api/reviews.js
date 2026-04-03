export async function getProductReviews(slug) {
  const response = await fetch(`/api/products/${slug}/reviews`);
  const data = await response.json();
 
  if (!response.ok) throw new Error(data.error);
  return data.reviews;
}
 
export async function addProductReview(slug, rating, comment) {
  const response = await fetch(`/api/products/${slug}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating, comment }),
  });
 
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
 
  return data.review;
}