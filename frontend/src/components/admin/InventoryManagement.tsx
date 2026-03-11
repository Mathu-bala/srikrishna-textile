import { useState, useEffect } from 'react';
import {
    Search, Plus, Filter,
    AlertTriangle, DollarSign, Package, Activity, MoreVertical, RefreshCw, Trash2, Edit
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    getInventoryItems,
    getInventoryStats,
    adjustInventoryStock,
    syncInventoryItems,
    createInventoryItem,
    deleteInventoryItem,
    fetchProducts
} from '@/services/api';
import { toast } from 'sonner';

interface InventoryItem {
    _id: string;
    productId: {
        _id: string;
        name: string;
        image: string;
        category: string;
    };
    productName: string;
    sku: string;
    variant: string;
    stockLevel: number;
    price: number;
    totalValue: number;
    status: string;
}

interface InventoryStats {
    totalItemsInStock: number;
    totalInventoryValue: number;
    lowStockAlerts: number;
    outOfStock: number;
}

const InventoryManagement = () => {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [stats, setStats] = useState<InventoryStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // Modals
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    
    // Add fields
    const [products, setProducts] = useState<any[]>([]);
    const [newStock, setNewStock] = useState({
        productId: '', sku: '', variant: 'Standard', stockLevel: 0, price: 0
    });

    // Form edit fields
    const [editLevel, setEditLevel] = useState(0);
    const [editPrice, setEditPrice] = useState(0);
    const [editVariant, setEditVariant] = useState('');

    const loadData = async () => {
        try {
            setLoading(true);
            const [itemsData, statsData] = await Promise.all([
                getInventoryItems(page, searchQuery),
                getInventoryStats()
            ]);
            setItems(itemsData.items || []);
            setTotalPages(itemsData.pages || 1);
            setStats(statsData);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const loadProducts = async () => {
        if (products.length === 0) {
            try {
                const p = await fetchProducts();
                setProducts(p);
            } catch (err) {
                console.error(err);
            }
        }
    };

    useEffect(() => {
        const delays = setTimeout(() => {
            loadData();
        }, 300);
        return () => clearTimeout(delays);
    }, [page, searchQuery]);

    const handleSync = async () => {
        try {
            setLoading(true);
            const res = await syncInventoryItems();
            toast.success(res.message || 'Products Synced Successfully');
            loadData();
        } catch (error: any) {
            toast.error(error.message || 'Sync failed');
            setLoading(false);
        }
    };

    const handleUpdateStock = async () => {
        if (!selectedItem) return;

        try {
            await adjustInventoryStock(selectedItem._id, {
                stockLevel: editLevel,
                price: editPrice,
                variant: editVariant
            });
            toast.success('Stock updated successfully');
            loadData();
            setIsAdjustModalOpen(false);
        } catch (error: any) {
            toast.error(error.message || 'Failed to update stock');
        }
    };

    const handleAddStock = async () => {
        try {
            await createInventoryItem(newStock);
            toast.success('Inventory added successfully');
            loadData();
            setIsAddModalOpen(false);
            setNewStock({ productId: '', sku: '', variant: 'Standard', stockLevel: 0, price: 0 });
        } catch (error: any) {
            toast.error(error.message || 'Failed to add stock');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this inventory record?')) return;
        try {
            await deleteInventoryItem(id);
            toast.success('Inventory record deleted');
            loadData();
        } catch (error: any) {
            toast.error('Failed to delete');
        }
    };

    const openAdjustModal = (item: InventoryItem) => {
        setSelectedItem(item);
        setEditLevel(item.stockLevel);
        setEditPrice(item.price);
        setEditVariant(item.variant);
        setIsAdjustModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Heading */}
            <div>
                <h2 className="text-2xl font-bold font-display">Inventory <span className="text-gradient-neon">Management</span></h2>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-5 border-l-4 border-l-primary">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium">Total Inventory Value</p>
                            <h3 className="text-2xl font-display font-bold mt-1">₹{(stats?.totalInventoryValue || 0).toLocaleString()}</h3>
                        </div>
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <DollarSign size={20} />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-5 border-l-4 border-l-neon-green">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium">Total Items in Stock</p>
                            <h3 className="text-2xl font-display font-bold mt-1">{stats?.totalItemsInStock || 0}</h3>
                        </div>
                        <div className="p-2 bg-neon-green/10 rounded-lg text-neon-green">
                            <Package size={20} />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-5 border-l-4 border-l-secondary">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium">Low Stock Alerts</p>
                            <h3 className="text-2xl font-display font-bold mt-1">{stats?.lowStockAlerts || 0}</h3>
                        </div>
                        <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                            <Activity size={20} />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-5 border-l-4 border-l-destructive">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium">Out of Stock</p>
                            <h3 className="text-2xl font-display font-bold mt-1">{stats?.outOfStock || 0}</h3>
                        </div>
                        <div className="p-2 bg-destructive/10 rounded-lg text-destructive">
                            <AlertTriangle size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        placeholder="Search by SKU, Product Name..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" className="gap-2" onClick={handleSync}>
                        <RefreshCw size={16} /> Sync From Products
                    </Button>
                    <Button className="btn-neon gap-2" onClick={() => { loadProducts(); setIsAddModalOpen(true); }}>
                        <Plus size={16} /> Add New Stock
                    </Button>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/30">
                            <tr>
                                <th className="text-left p-4 font-medium text-muted-foreground">Product Details</th>
                                <th className="text-left p-4 font-medium text-muted-foreground">SKU / Variant</th>
                                <th className="text-left p-4 font-medium text-muted-foreground">Stock Level</th>
                                <th className="text-left p-4 font-medium text-muted-foreground">Value</th>
                                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-8 text-muted-foreground">
                                        No inventory records found.
                                        <div onClick={handleSync} className="mt-2 text-sm text-secondary cursor-pointer hover:underline flex items-center justify-center gap-2">
                                            <RefreshCw size={14} /> Sync from Products?
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item._id} className="border-t border-border/30 hover:bg-muted/20 transition-colors">
                                        <td className="p-4">
                                            <Link to={`/product/${item.productId?._id}`} target="_blank" className="flex items-center gap-3 group">
                                                <div className="w-10 h-10 rounded bg-muted/50 overflow-hidden group-hover:ring-2 ring-primary/50 transition-all">
                                                    {item.productId?.image && <img src={item.productId.image} className="w-full h-full object-cover" />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">{item.productName || 'Unknown Product'}</p>
                                                    <p className="text-xs text-muted-foreground uppercase">{item.productId?.category || 'General'}</p>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-mono text-xs bg-muted/50 px-2 py-1 rounded w-fit">{item.sku}</span>
                                                <span className="text-xs text-muted-foreground mt-1">
                                                    {item.variant}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-bold ${item.stockLevel <= 10 ? 'text-destructive' : ''}`}>
                                                    {item.stockLevel}
                                                </span>
                                            </div>
                                            <div className="w-24 h-1.5 bg-muted rounded-full mt-1.5 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${item.stockLevel <= 10 ? 'bg-destructive' : 'bg-green-500'}`}
                                                    style={{ width: `${Math.min((item.stockLevel / 100) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm">
                                                <p>Price: <span className="font-medium">₹{item.price}</span></p>
                                                <p className="text-primary mt-1">Tot: <span className="font-medium">₹{(item.totalValue || 0).toLocaleString()}</span></p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${item.status === 'Out of Stock'
                                                ? 'bg-destructive/10 text-destructive border-destructive/20'
                                                : item.status === 'Low Stock'
                                                    ? 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                                                    : 'bg-green-500/10 text-green-500 border-green-500/20'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => openAdjustModal(item)}>
                                                    <Edit size={16} />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(item._id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-border/30 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground pl-2">Page {page} of {totalPages}</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                        <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>Next</Button>
                    </div>
                </div>
            </div>

            {/* Edit Stock Modal */}
            {isAdjustModalOpen && selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-card w-full max-w-md p-6 rounded-xl border shadow-2xl">
                        <h3 className="font-display text-xl font-bold mb-4">Edit Stock</h3>
                        <div className="bg-muted/30 p-3 rounded-lg mb-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted rounded overflow-hidden">
                                {selectedItem.productId?.image && <img src={selectedItem.productId.image} className="w-full h-full object-cover" />}
                            </div>
                            <div>
                                <p className="font-medium text-sm">{selectedItem.productName}</p>
                                <p className="text-xs text-muted-foreground">{selectedItem.sku}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Variant</label>
                                <Input value={editVariant} onChange={(e) => setEditVariant(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Quantity</label>
                                <Input type="number" min="0" value={editLevel} onChange={(e) => setEditLevel(Number(e.target.value))} />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Price</label>
                                <Input type="number" min="0" value={editPrice} onChange={(e) => setEditPrice(Number(e.target.value))} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="outline" onClick={() => setIsAdjustModalOpen(false)}>Cancel</Button>
                            <Button className="btn-neon" onClick={handleUpdateStock}>Save Changes</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add New Stock Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-card w-full max-w-md p-6 rounded-xl border shadow-2xl overflow-y-auto max-h-[90vh]">
                        <h3 className="font-display text-xl font-bold mb-4">Add New Stock</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Product</label>
                                <select 
                                    className="w-full p-2 border border-border rounded-md bg-transparent"
                                    value={newStock.productId}
                                    onChange={(e) => setNewStock({ ...newStock, productId: e.target.value })}
                                >
                                    <option value="">Select a Product</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">SKU</label>
                                <Input value={newStock.sku} onChange={(e) => setNewStock({ ...newStock, sku: e.target.value })} placeholder="e.g., SAREE-RED-M" />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Variant</label>
                                <Input value={newStock.variant} onChange={(e) => setNewStock({ ...newStock, variant: e.target.value })} placeholder="e.g., Standard, Red, L" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Quantity</label>
                                    <Input type="number" min="0" value={newStock.stockLevel || ''} onChange={(e) => setNewStock({ ...newStock, stockLevel: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Price</label>
                                    <Input type="number" min="0" value={newStock.price || ''} onChange={(e) => setNewStock({ ...newStock, price: Number(e.target.value) })} />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                            <Button className="btn-neon" onClick={handleAddStock} disabled={!newStock.productId || !newStock.sku}>Add Stock</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryManagement;
