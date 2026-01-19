export const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORD-${timestamp.toString(36).slice(-6)}-${random.toString().padStart(4, '0')}`;
};