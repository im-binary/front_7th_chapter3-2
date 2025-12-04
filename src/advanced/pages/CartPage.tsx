import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ProductWithUI } from '../hooks/useProducts';
import { Coupon } from '../../types';
import {
  ProductList,
  OrderSummary,
  CartSummary,
  CouponSelectorContainer,
} from '../components/cart';
import { calculateCartTotal } from '../models/cart';
import {
  useProductsContext,
  useCartContext,
  useCouponsContext,
  useNotificationsContext,
} from '../contexts';
import { formatCurrency } from '../utils/formatters';
import { getRemainingStock } from '../models/cart';
import { isOutOfStock } from '../models/product';

interface CartPageProps {
  searchTerm: string;
}

export const CartPage: React.FC<CartPageProps> = ({ searchTerm }) => {
  const { products } = useProductsContext();
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart } =
    useCartContext();
  const { coupons } = useCouponsContext();
  const { addNotification } = useNotificationsContext();

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 선택된 쿠폰이 삭제되면 선택 해제
  useEffect(() => {
    if (
      selectedCoupon &&
      !coupons.find((c) => c.code === selectedCoupon.code)
    ) {
      setSelectedCoupon(null);
    }
  }, [coupons, selectedCoupon]);

  const formatPrice = useCallback(
    (price: number, productId?: string): string => {
      if (productId) {
        const product = products.find((p) => p.id === productId);
        if (product) {
          const remainingStock = getRemainingStock({ product, cart });
          if (isOutOfStock(remainingStock)) {
            return 'SOLD OUT';
          }
        }
      }

      return formatCurrency(price);
    },
    [products, cart]
  );

  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [products, searchTerm]);

  const totals = useMemo(() => {
    return calculateCartTotal({ cart, selectedCoupon });
  }, [cart, selectedCoupon]);

  const handleAddToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock({ cart, product });
      if (remainingStock <= 0) {
        addNotification('재고가 부족합니다!', 'error');
        return;
      }

      const existingItem = cart.find((item) => item.product.id === product.id);
      if (existingItem && existingItem.quantity + 1 > product.stock) {
        addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
        return;
      }

      addToCart(product);
      addNotification('장바구니에 담았습니다', 'success');
    },
    [cart, addToCart, addNotification]
  );

  const handleUpdateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
        return;
      }

      updateQuantity(productId, newQuantity);
    },
    [products, updateQuantity, addNotification]
  );

  const handleCompleteOrder = () => {
    clearCart();
    setSelectedCoupon(null);
    addNotification('주문이 완료되었습니다!', 'success');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductList
          products={filteredProducts}
          cart={cart}
          formatPrice={formatPrice}
          onAddToCart={handleAddToCart}
          searchTerm={searchTerm}
        />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <CartSummary
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={removeFromCart}
          />

          {cart.length > 0 && (
            <>
              <CouponSelectorContainer
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                onSelectCoupon={setSelectedCoupon}
              />

              <OrderSummary
                totalBeforeDiscount={totals.totalBeforeDiscount}
                totalAfterDiscount={totals.totalAfterDiscount}
                onCompleteOrder={handleCompleteOrder}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
