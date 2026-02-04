import { useState, useEffect } from 'react';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { categories } from '@/data/products';
import { createProduct, updateProduct } from '@/services/api';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: any; // Using any for flexibility with backend structure
    onSuccess: () => void;
}

const ProductModal = ({ isOpen, onClose, product, onSuccess }: ProductModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        stock: '',
        image: '',
        description: '',
        fabric: '',
        inStock: true
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                price: product.price || '',
                category: product.category || '',
                stock: product.stock !== undefined ? product.stock : 50,
                image: product.image || '',
                description: product.description || '',
                fabric: product.fabric || '',
                inStock: product.stock > 0
            });
        } else {
            setFormData({
                name: '',
                price: '',
                category: 'sarees',
                stock: '50',
                image: '',
                description: '',
                fabric: '',
                inStock: true
            });
        }
    }, [product, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, category: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                inStock: Number(formData.stock) > 0,
                // Default required fields if missing
                id: product?.id || undefined
            };

            if (product) {
                await updateProduct(product.id, payload);
            } else {
                await createProduct(payload);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to save product:', error);
            // Ideally show toast error here
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-card border-border/50 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                    <DialogDescription>
                        {product ? 'Make changes to the product details.' : 'Fill in the details to create a new product.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Silk Saree"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={formData.category} onValueChange={handleSelectChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (₹)</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="e.g. 1500"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock Quantity</Label>
                            <Input
                                id="stock"
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="e.g. 50"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">Image URL</Label>
                        <Input
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            required
                        />
                        <p className="text-xs text-muted-foreground">Check Unsplash for generic images if needed.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fabric">Fabric Type</Label>
                        <Input
                            id="fabric"
                            name="fabric"
                            value={formData.fabric}
                            onChange={handleChange}
                            placeholder="e.g. Cotton, Silk"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Product description..."
                            rows={3}
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="btn-neon" disabled={loading}>
                            {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ProductModal;
