
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  featured: boolean;
}

interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  searchTerm: string;
  selectedCategory: string;
}

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
];

const initialState: ProductsState = {
  products: mockProducts,
  filteredProducts: mockProducts,
  searchTerm: '',
  selectedCategory: 'All',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.filteredProducts = state.products.filter(product =>
        product.name.toLowerCase().includes(action.payload.toLowerCase()) &&
        (state.selectedCategory === 'All' || product.category === state.selectedCategory)
      );
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      state.filteredProducts = state.products.filter(product =>
        (action.payload === 'All' || product.category === action.payload) &&
        product.name.toLowerCase().includes(state.searchTerm.toLowerCase())
      );
    },
  },
});

export const { setSearchTerm, setSelectedCategory } = productsSlice.actions;
export default productsSlice.reducer;
