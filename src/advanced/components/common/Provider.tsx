import React, { ReactNode } from 'react';
import {
  ProductsProvider,
  CartProvider,
  CouponsProvider,
  NotificationsProvider,
} from '../../contexts';

interface ProviderProps {
  children: ReactNode;
}

export const Provider: React.FC<ProviderProps> = ({ children }) => {
  return (
    <NotificationsProvider>
      <ProductsProvider>
        <CartProvider>
          <CouponsProvider>{children}</CouponsProvider>
        </CartProvider>
      </ProductsProvider>
    </NotificationsProvider>
  );
};
