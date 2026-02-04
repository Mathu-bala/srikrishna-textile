
import { useState, useEffect } from 'react';
import {
    Search, Plus, Filter, ArrowUpRight, ArrowDownRight,
    AlertTriangle, DollarSign, Package, Activity, MoreVertical, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    getInventoryItems,
    getInventoryStats,
    adjustInventoryStock,
    syncInventoryItems
} from '@/services/api';
import { toast } from 'sonner';

interface InventoryItem {
    id: string;
    sku: string;
    product: {
        id: string;
        name: string;
        image: string;
        category: string;
    };
    variant: {
        size: string;
        color: string;
    };
    stock: {
        total: number;
        reserved: number;
        threshold: number;
    };
    pricing: {
        costPrice: number;
        sellingPrice: number;
    };
    status: string;
}

interface InventoryStats {
    totalProductVariants: number;
    totalStockValue: number;
    totalStockCount: number;
    lowStockCount: number;
    outOfStockCount: number;
}

const InventoryManagement = () => {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [stats, setStats] = useState<InventoryStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [adjustQty, setAdjustQty] = useState(0);
    const [adjustAction, setAdjustAction] = useState('restock');
    const [adjustNotes, setAdjustNotes] = useState('');

    const loadData = async () => {
        try {
            setLoading(true);
            const [itemsData, statsData] = await Promise.all([
                getInventoryItems(page, searchQuery),
                getInventoryStats()
            ]);
            setItems(itemsData.inventory);
            setStats(statsData);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [page, searchQuery]);

    const handleSync = async () => {
        try {
            setLoading(true);
            const res = await syncInventoryItems();
            toast.success(res.message);
            loadData();
        } catch (error: any) {
            toast.error('Sync failed');
            setLoading(false);
        }
    };

    const handleAdjustStock = async () => {
        if (!selectedItem || adjustQty <= 0) return;

        try {
            await adjustInventoryStock(selectedItem.id, {
                action: adjustAction,
                quantity: adjustQty,
                notes: adjustNotes
            });
            toast.success('Stock updated successfully');
            loadData();
            setIsAdjustModalOpen(false);
            setAdjustQty(0);
            setAdjustNotes('');
        } catch (error: any) {
            toast.error(error.message || 'Failed to update stock');
        }
    };

    const openAdjustModal = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsAdjustModalOpen(true);
        setAdjustAction('restock'); // default
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
                            <h3 className="text-2xl font-display font-bold mt-1">₹{(stats?.totalStockValue || 0).toLocaleString()}</h3>
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
                            <h3 className="text-2xl font-display font-bold mt-1">{stats?.totalStockCount || 0}</h3>
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
                            <h3 className="text-2xl font-display font-bold mt-1">{stats?.lowStockCount || 0}</h3>
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
                            <h3 className="text-2xl font-display font-bold mt-1">{stats?.outOfStockCount || 0}</h3>
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
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" className="gap-2">
                        <Filter size={16} /> Filters
                    </Button>
                    <Button className="btn-neon gap-2">
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
                                    <tr key={item.id} className="border-t border-border/30 hover:bg-muted/20 transition-colors">
                                        <td className="p-4">
                                            <Link to={`/product/${item.product?.id}`} target="_blank" className="flex items-center gap-3 group">
                                                <div className="w-10 h-10 rounded bg-muted/50 overflow-hidden group-hover:ring-2 ring-primary/50 transition-all">
                                                    {item.product?.image && <img src={item.product.image} className="w-full h-full object-cover" />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">{item.product?.name || 'Unknown Product'}</p>
                                                    <p className="text-xs text-muted-foreground uppercase">{item.product?.category}</p>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-mono text-xs bg-muted/50 px-2 py-1 rounded w-fit">{item.sku}</span>
                                                <span className="text-xs text-muted-foreground mt-1">
                                                    {item.variant?.color} • {item.variant?.size}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-bold ${item.stock.total <= item.stock.threshold ? 'text-destructive' : ''}`}>
                                                    {item.stock.total}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    (Reserved: {item.stock.reserved})
                                                </span>
                                            </div>
                                            <div className="w-24 h-1.5 bg-muted rounded-full mt-1.5 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${item.stock.total <= item.stock.threshold ? 'bg-destructive' : 'bg-green-500'}`}
                                                    style={{ width: `${Math.min((item.stock.total / 100) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm">
                                                <p>Cost: <span className="text-muted-foreground">₹{item.pricing.costPrice}</span></p>
                                                <p>Sell: <span className="font-medium">₹{item.pricing.sellingPrice}</span></p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${item.stock.total === 0
                                                ? 'bg-destructive/10 text-destructive border-destructive/20'
                                                : item.stock.total <= item.stock.threshold
                                                    ? 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                                                    : 'bg-green-500/10 text-green-500 border-green-500/20'
                                                }`}>
                                                {item.stock.total === 0 ? 'Out of Stock' : item.stock.total <= item.stock.threshold ? 'Low Stock' : 'In Stock'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button variant="ghost" size="sm" onClick={() => openAdjustModal(item)}>
                                                <MoreVertical size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-border/30 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground pl-2">Page {page}</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                        <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)}>Next</Button>
                    </div>
                </div>
            </div>

            {isAdjustModalOpen && selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-card w-full max-w-md p-6 rounded-xl border shadow-2xl">
                        <h3 className="font-display text-xl font-bold mb-4">Adjust Stock</h3>
                        <div className="bg-muted/30 p-3 rounded-lg mb-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted rounded overflow-hidden">
                                {selectedItem.product?.image && <img src={selectedItem.product.image} className="w-full h-full object-cover" />}
                            </div>
                            <div>
                                <p className="font-medium text-sm">{selectedItem.product?.name}</p>
                                <p className="text-xs text-muted-foreground">{selectedItem.sku}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Action</label>
                                <select
                                    className="w-full p-2 rounded-md bg-muted border border-border"
                                    value={adjustAction}
                                    onChange={(e) => setAdjustAction(e.target.value)}
                                >
                                    <option value="restock">Restock (Add)</option>
                                    <option value="adjustment">Damage/Theft (Deduct)</option>
                                    <option value="return">Customer Return (Add)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Quantity</label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={adjustQty}
                                    onChange={(e) => setAdjustQty(Number(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Notes/Reason</label>
                                <Input
                                    placeholder="e.g., Received shipment #123"
                                    value={adjustNotes}
                                    onChange={(e) => setAdjustNotes(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="outline" onClick={() => setIsAdjustModalOpen(false)}>Cancel</Button>
                            <Button className="btn-neon" onClick={handleAdjustStock}>Save Adjustment</Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default InventoryManagement;
