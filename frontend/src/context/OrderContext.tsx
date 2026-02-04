import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '@/data/products';
import { createOrder, getUserOrders } from '@/services/api';
import { useAuth } from './AuthContext';

export interface OrderItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'placed' | 'processing' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled' | 'skipped';
  createdAt: string;
  estimatedDelivery: string;
  shippingAddress: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (items: OrderItem[], total: number) => Promise<Order>;
  getOrder: (orderId: string) => Order | undefined;
  loading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const data = await getUserOrders();
          setOrders(data);
        } catch (error) {
          console.error('Failed to fetch orders:', error);
        }
      } else {
        setOrders([]);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  const addOrder = async (items: OrderItem[], total: number): Promise<Order> => {
    try {
      const orderData = {
        items,
        total,
        shippingAddress: '123, Textile Market, T. Nagar, Chennai - 600017', // Sample address
      };
      const newOrder = await createOrder(orderData);
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  };

  const getOrder = (orderId: string) => {
    return orders.find((order) => order.id === orderId);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, getOrder, loading }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
