import { CartItem, Coupon } from '../../types';
import { getMaxApplicableDiscount } from '../models/discount';
import { applyCouponDiscount } from '../models/coupon';

/**
 * 개별 아이템의 할인이 적용된 총 금액을 계산
 */
export const calculateItemTotal = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount({ item, cart });

  return Math.round(price * quantity * (1 - discount));
};

/**
 * 장바구니 전체의 할인 전/후 총 금액을 계산
 */
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item, cart);
  });

  if (selectedCoupon) {
    totalAfterDiscount = applyCouponDiscount({
      coupon: selectedCoupon,
      totalAmount: totalAfterDiscount,
    });
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
};

/**
 * 장바구니 아이템의 수량을 업데이트
 */
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  if (newQuantity <= 0) {
    return cart.filter((item) => item.product.id !== productId);
  }

  return cart.map((item) =>
    item.product.id === productId ? { ...item, quantity: newQuantity } : item
  );
};
