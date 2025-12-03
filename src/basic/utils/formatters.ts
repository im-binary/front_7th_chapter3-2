import { Product, CartItem } from '../../types';
import { getRemainingStock as getStock } from '../models/cart';
import { isOutOfStock } from '../models/product';

export const formatPrice = (
  price: number,
  product: Product | undefined,
  cart: CartItem[],
  isAdmin: boolean
): string => {
  if (product) {
    const remainingStock = getStock({ product, cart });
    if (isOutOfStock(remainingStock)) {
      return 'SOLD OUT';
    }
  }

  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }

  return `₩${price.toLocaleString()}`;
};
