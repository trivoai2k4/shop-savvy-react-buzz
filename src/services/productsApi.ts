
import { Product } from '../store/productsSlice';

// Mock API data - in a real app, this would come from a backend
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    category: "Electronics",
    description: "High-quality wireless headphones with noise cancellation",
    featured: true,
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "Electronics",
    description: "Advanced smartwatch with health monitoring",
    featured: true,
  },
  {
    id: 3,
    name: "Designer Laptop Bag",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    category: "Accessories",
    description: "Stylish and functional laptop bag for professionals",
    featured: false,
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
    category: "Electronics",
    description: "Portable speaker with premium sound quality",
    featured: true,
  },
  {
    id: 5,
    name: "Fitness Tracker",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=500&fit=crop",
    category: "Electronics",
    description: "Track your fitness goals with this advanced tracker",
    featured: false,
  },
  {
    id: 6,
    name: "Wireless Mouse",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop",
    category: "Electronics",
    description: "Ergonomic wireless mouse for productivity",
    featured: false,
  },
  {
    id: 7,
    name: "4K Webcam",
    price: 179.99,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83Add3?w=500&h=500&fit=crop",
    category: "Electronics",
    description: "Ultra HD webcam for professional video calls",
    featured: false,
  },
  {
    id: 8,
    name: "Mechanical Keyboard",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop",
    category: "Electronics",
    description: "Premium mechanical keyboard for gaming and typing",
    featured: true,
  },
  {
    id: 9,
    name: "USB-C Hub",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500&h=500&fit=crop",
    category: "Accessories",
    description: "Multi-port USB-C hub for connectivity",
    featured: false,
  },
  {
    id: 10,
    name: "Portable Charger",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1609592094878-7ea2cc4e2da0?w=500&h=500&fit=crop",
    category: "Accessories",
    description: "High-capacity portable battery pack",
    featured: false,
  },
];

export interface ProductsResponse {
  products: Product[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export const fetchProducts = async (params: ProductsQueryParams = {}): Promise<ProductsResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const { page = 1, limit = 6, search = '', category = 'All' } = params;
  
  // Filter products
  let filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const totalCount = filteredProducts.length;
  const totalPages = Math.ceil(totalCount / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return {
    products: paginatedProducts,
    totalCount,
    totalPages,
    currentPage: page,
  };
};
