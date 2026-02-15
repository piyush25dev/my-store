export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function getDiscount(price, originalPrice) {
  if (!originalPrice) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}