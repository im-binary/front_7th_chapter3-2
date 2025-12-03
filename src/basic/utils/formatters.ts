import { Product, CartItem } from '../../types';

export const formatPrice = (
  price: number,
  product: Product | undefined,
  cart: CartItem[],
  isAdmin: boolean
): string => {
  if (product) {
    const remainingStock = getRemainingStock(product, cart);
    if (remainingStock <= 0) {
      return 'SOLD OUT';
    }
  }

  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }

  return `₩${price.toLocaleString()}`;
};

export const getRemainingStock = (
  product: Product,
  cart: CartItem[]
): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
};
