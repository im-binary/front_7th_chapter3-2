import { useState } from 'react';
import {
  Header,
  Logo,
  SearchBar,
  CartBadge,
  ToggleButton,
} from './components/primitives';
import { NotificationContainer } from './components/common/Notification';
import { Provider } from './components/common/Provider';
import { CartPage } from './pages/CartPage';
import { AdminPage } from './pages/AdminPage';
import { useCartContext, useNotificationsContext } from './contexts';
import { useDebounce } from './hooks/useDebounce';

const AppContent = () => {
  const { totalItemCount } = useCartContext();
  const { notifications, removeNotification } = useNotificationsContext();

  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />

      <Header>
        <Header.Left>
          <Logo text="SHOP" />
          {!isAdmin && (
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="상품 검색..."
            />
          )}
        </Header.Left>
        <Header.Right>
          <ToggleButton
            isActive={isAdmin}
            activeText="쇼핑몰로 돌아가기"
            inactiveText="관리자 페이지로"
            onClick={() => setIsAdmin(!isAdmin)}
          />
          {!isAdmin && <CartBadge count={totalItemCount} />}
        </Header.Right>
      </Header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage />
        ) : (
          <CartPage searchTerm={debouncedSearchTerm} />
        )}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Provider>
      <AppContent />
    </Provider>
  );
};

export default App;
