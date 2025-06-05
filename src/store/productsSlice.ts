
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: number;
  title: string;
  name?: string; // For compatibility
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  category: string;
  thumbnail: string;
  image?: string; // For compatibility
  images?: string[];
  featured?: boolean;
}

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<{
      products: Product[];
      currentPage: number;
      totalPages: number;
      totalCount: number;
    }>) => {
      state.items = action.payload.products;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.totalCount = action.payload.totalCount;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setProducts, setLoading, setError } = productsSlice.actions;
export default productsSlice.reducer;
