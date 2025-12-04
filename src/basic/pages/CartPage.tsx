import React from 'react';
import { ProductWithUI } from '../hooks/useProducts';
import { CartItem, Coupon } from '../../types';
import {
  ProductList,
  OrderSummary,
  CartSummary,
  CouponSelectorContainer,
} from '../components/cart';

interface CartPageProps {
  products: ProductWithUI[];
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  searchTerm: string;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  formatPrice: (price: number, productId?: string) => string;
  onAddToCart: (product: ProductWithUI) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onSelectCoupon: (coupon: Coupon | null) => void;
  onCompleteOrder: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  products,
  cart,
  coupons,
  selectedCoupon,
  searchTerm,
  totals,
  formatPrice,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onSelectCoupon,
  onCompleteOrder,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductList
          products={products}
          cart={cart}
          isAdmin={false}
          formatPrice={formatPrice}
          onAddToCart={onAddToCart}
          searchTerm={searchTerm}
        />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <CartSummary
            cart={cart}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveFromCart={onRemoveFromCart}
          />

          {cart.length > 0 && (
            <>
              <CouponSelectorContainer
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                onSelectCoupon={onSelectCoupon}
              />

              <OrderSummary
                totalBeforeDiscount={totals.totalBeforeDiscount}
                totalAfterDiscount={totals.totalAfterDiscount}
                onCompleteOrder={onCompleteOrder}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
