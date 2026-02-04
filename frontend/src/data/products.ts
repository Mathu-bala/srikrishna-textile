export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  fabric: string;
  description: string;
  image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  rating: number;
  reviews: number;
  searchTags: string[];
  stock: number;
}

export const categories = [
  { id: 'sarees', name: 'Sarees', icon: '🥻', count: 50 },
  { id: 'kurtis', name: 'Kurtis', icon: '👗', count: 50 },
  { id: 'mens', name: 'Men\'s Wear', icon: '👔', count: 50 },
  { id: 'kids', name: 'Kids Wear', icon: '🧒', count: 50 },
  { id: 'fabrics', name: 'Fabrics', icon: '🧵', count: 50 },
];
