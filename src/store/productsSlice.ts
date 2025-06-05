import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchProducts as fetchProductsApi, fetchCategories as fetchCategoriesApi, ProductsQueryParams } from '../services/productsApi';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  // Compatibility fields added by transformation
  name: string;
  image: string;
  featured: boolean;
}

interface ProductsState {
  items: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  // Add caching metadata for performance
  lastFetch: number | null;
  cacheKey: string | null;
}

const initialState: ProductsState = {
  items: [],
  categories: ['All'],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  lastFetch: null,
  cacheKey: null,
};

// Helper to generate cache key
const generateCacheKey = (params: ProductsQueryParams): string => {
  return JSON.stringify(params);
};

// Async thunk for fetching products with caching logic
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: ProductsQueryParams = {}, { getState }) => {
    const state = getState() as { products: ProductsState };
    const cacheKey = generateCacheKey(params);
    const now = Date.now();
    const cacheTime = 5 * 60 * 1000; // 5 minutes cache
    
    // Check if we have cached data that's still valid
    if (
      state.products.lastFetch &&
      state.products.cacheKey === cacheKey &&
      now - state.products.lastFetch < cacheTime &&
      state.products.items.length > 0
    ) {
      // Return cached data
      return {
        products: state.products.items,
        totalCount: state.products.totalCount,
        totalPages: state.products.totalPages,
        currentPage: state.products.currentPage,
        fromCache: true,
      };
    }
    
    const response = await fetchProductsApi(params);
    return {
      ...response,
      fromCache: false,
      cacheKey,
    };
  }
);

// Async thunk for fetching categories with caching
export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { getState }) => {
    const state = getState() as { products: ProductsState };
    
    // Only fetch if we don't have categories or just have 'All'
    if (state.products.categories.length > 1) {
      return state.products.categories;
    }
    
    const categories = await fetchCategoriesApi();
    return categories;
  }
);

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
    clearCache: (state) => {
      state.lastFetch = null;
      state.cacheKey = null;
    },
    updateProduct: (state, action: PayloadAction<Partial<Product> & { id: number }>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Handle fetchProducts async thunk
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        
        if (!action.payload.fromCache) {
          state.items = action.payload.products;
          state.currentPage = action.payload.currentPage;
          state.totalPages = action.payload.totalPages;
          state.totalCount = action.payload.totalCount;
          state.lastFetch = Date.now();
          state.cacheKey = action.payload.cacheKey || null;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      // Handle fetchCategories async thunk
      .addCase(fetchCategories.pending, (state) => {
        // Don't set loading for categories if we already have some
        if (state.categories.length <= 1) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });
  },
});

export const { setProducts, setLoading, setError, clearCache, updateProduct } = productsSlice.actions;
export default productsSlice.reducer;
