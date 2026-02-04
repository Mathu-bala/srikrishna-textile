import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package, AlertTriangle, Plus, Minus, Search, Edit, Save, Trash2,
  LayoutDashboard, ShoppingBag, Archive, ClipboardList, Users, LogOut, Zap,
  IndianRupee, CheckCircle
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { fetchProducts, updateProduct, deleteProduct, getAdminOrders } from '@/services/api';
import UsersManagement from '@/components/admin/UsersManagement';
import OrdersManagement from '@/components/admin/OrdersManagement';
import InventoryManagement from '@/components/admin/InventoryManagement';
import ProductModal from '@/components/admin/ProductModal';

import { getImageUrl } from '@/lib/imageUtils';

interface ProductStock {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

const AdminDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventory, setInventory] = useState<ProductStock[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductStock | null>(null);

  // Initialize data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [products, orders] = await Promise.all([
        fetchProducts(),
        getAdminOrders({ status: 'delivered' }) // Fetch delivered orders for revenue
      ]);

      // Set Inventory
      setInventory(
        products.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          stock: p.stock !== undefined ? p.stock : 0,
          image: p.image,
        }))
      );

      // Calculate Revenue from Delivered Orders
      const revenue = Array.isArray(orders)
        ? orders.reduce((sum: number, order: any) => sum + (order.totalAmount || order.total || 0), 0)
        : 0;
      setTotalRevenue(revenue);

    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center bg-background relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-destructive/10 rounded-full blur-3xl" />
          </div>
          <div className="text-center relative z-10">
            <div className="w-24 h-24 rounded-2xl bg-destructive/20 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={48} className="text-destructive" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You need admin privileges to access this page.
            </p>
            <Button onClick={() => navigate('/login')} className="btn-neon">
              Login as Admin
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const filteredInventory = inventory.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockItems = inventory.filter((p) => p.stock < 5);

  const updateStock = async (id: string, delta: number) => {
    const product = inventory.find(p => p.id === id);
    if (!product) return;

    const newStock = Math.max(0, product.stock + delta);

    // Update UI optimistically
    setInventory((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stock: newStock } : p
      )
    );

    // Update Backend
    try {
      await updateProduct(id, { stock: newStock });
    } catch (error) {
      console.error("Failed to update stock", error);
      loadDashboardData(); // Reload on error
    }
  };

  const handleManualStockChange = (id: string, value: number) => {
    setInventory((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, value) } : p))
    );
  };

  const saveStock = async (id: string) => {
    const product = inventory.find(p => p.id === id);
    if (product) {
      try {
        await updateProduct(id, { stock: product.stock });
        setEditingId(null);
      } catch (error) {
        console.error("Failed to save stock", error);
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        loadDashboardData();
      } catch (error) {
        console.error('Failed to delete product', error);
      }
    }
  };

  const openAddModal = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const openEditModal = (product: ProductStock) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'inventory', label: 'Inventory', icon: Archive },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'users', label: 'Users', icon: Users },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UsersManagement />;
      case 'orders':
        return <OrdersManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'dashboard':
      case 'products':
      default:
        return (
          <>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <div>
                <h1 className="font-display text-3xl font-bold">
                  {activeTab === 'products' ? 'Product' : 'Admin'} <span className="text-gradient-neon">{activeTab === 'products' ? 'Management' : 'Dashboard'}</span>
                </h1>
                <p className="text-muted-foreground">Welcome back, {user?.name}</p>
              </div>
              <Button onClick={openAddModal} className="btn-neon">
                <Plus size={18} className="mr-2" />
                Add New Product
              </Button>
            </div>

            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
              <div className="glass-card p-4 mb-6 border-l-4 border-l-destructive">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-destructive" size={20} />
                  <div>
                    <p className="font-medium text-destructive">Low Stock Alert</p>
                    <p className="text-sm text-muted-foreground">
                      {lowStockItems.length} product{lowStockItems.length > 1 ? 's' : ''} below 5 units
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

              {/* Total Products */}
              <div className="glass-card p-4 hover:shadow-neon-purple transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Package size={20} className="text-white" />
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">Total Products</p>
                <p className="font-display text-2xl font-bold">{inventory.length}</p>
              </div>

              {/* In Stock */}
              <div className="glass-card p-4 hover:shadow-neon-green transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <CheckCircle size={20} className="text-white" />
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">In Stock</p>
                <p className="font-display text-2xl font-bold text-neon-green">
                  {inventory.filter((p) => p.stock > 0).length}
                </p>
              </div>

              {/* Low Stock */}
              <div className="glass-card p-4 hover:shadow-neon-pink transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                    <AlertTriangle size={20} className="text-white" />
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">Low Stock</p>
                <p className="font-display text-2xl font-bold text-accent">
                  {lowStockItems.length}
                </p>
              </div>

              {/* Revenue */}
              <div className="glass-card p-4 hover:shadow-neon-cyan transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                    <IndianRupee size={20} className="text-white" />
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">Revenue</p>
                <p className="font-display text-2xl font-bold text-secondary">
                  ₹{(totalRevenue).toLocaleString()}
                </p>
              </div>

            </div>

            {/* Search */}
            <div className="relative max-w-md mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-border/50"
              />
            </div>

            {/* Inventory Table */}
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="text-left p-4 font-medium text-muted-foreground">Product</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Category</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Price</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Stock</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((product) => (
                      <tr key={product.id} className="border-t border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Link to={`/product/${product.id}`} target="_blank" className="flex items-center gap-3 group">
                              <img
                                src={getImageUrl(product.image)}
                                alt={product.name}
                                className="w-12 h-14 object-cover rounded-lg group-hover:ring-2 ring-primary/50 transition-all"
                              />
                              <span className="font-medium line-clamp-1 max-w-48 group-hover:text-primary transition-colors">
                                {product.name}
                              </span>
                            </Link>
                          </div>
                        </td>
                        <td className="p-4 capitalize text-muted-foreground">{product.category}</td>
                        <td className="p-4">₹{product.price.toLocaleString()}</td>
                        <td className="p-4">
                          {editingId === product.id ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={product.stock}
                                onChange={(e) => handleManualStockChange(product.id, parseInt(e.target.value) || 0)}
                                className="w-20 h-8 bg-muted/50"
                              />
                              <Button size="sm" variant="ghost" onClick={() => saveStock(product.id)}>
                                <Save size={16} />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateStock(product.id, -1)}
                                className="w-7 h-7 rounded-lg border border-border/50 flex items-center justify-center hover:bg-muted/50 hover:border-secondary/50 transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-10 text-center font-medium">{product.stock}</span>
                              <button
                                onClick={() => updateStock(product.id, 1)}
                                className="w-7 h-7 rounded-lg border border-border/50 flex items-center justify-center hover:bg-muted/50 hover:border-secondary/50 transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${product.stock === 0
                              ? 'bg-destructive/20 text-destructive'
                              : product.stock < 5
                                ? 'bg-accent/20 text-accent'
                                : 'bg-neon-green/20 text-neon-green'
                              }`}
                          >
                            {product.stock === 0
                              ? 'Out of Stock'
                              : product.stock < 5
                                ? 'Low Stock'
                                : 'In Stock'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(product)}
                              className="hover:bg-primary/10 hover:text-primary"
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Product Modal */}
            <ProductModal
              isOpen={isProductModalOpen}
              onClose={() => setIsProductModalOpen(false)}
              product={selectedProduct}
              onSuccess={() => {
                loadInventory();
                setIsProductModalOpen(false);
              }}
            />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-background">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 min-h-[calc(100vh-140px)] bg-card/50 backdrop-blur-xl border-r border-border/50 p-4 hidden lg:block">
            <div className="mb-8">
              <h2 className="font-display text-lg font-bold text-gradient-neon">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">Manage your store</p>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id
                    ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-secondary border border-secondary/30'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-auto pt-8">
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow p-6">
            {renderTabContent()}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
