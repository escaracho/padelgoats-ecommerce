export const formatPrice = (price: string) => {
  const numericPrice = parseInt(price);
  return `$${numericPrice.toLocaleString('es')}`;
}; 