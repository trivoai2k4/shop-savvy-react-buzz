// Product interface matching the transformed data structure
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
  // Transformed/compatibility fields
  name: string;
  image: string;
  featured: boolean;
}

// Raw API response interface
interface RawProduct {
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
}

// Interface for category API response
interface CategoryResponse {
  slug: string;
  name: string;
  url: string;
}

export interface ProductsResponse {
  products: RawProduct[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

import RequestMiddleware from '../middleware/requestMiddleware';

const API_BASE_URL = 'https://dummyjson.com/products';

export const fetchProducts = async (params: ProductsQueryParams = {}): Promise<{
  products: Product[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}> => {
  const { page = 1, limit = 6, search = '', category = 'All' } = params;
  
  // Calculate skip parameter for pagination
  const skip = (page - 1) * limit;
  
  let url = '';
  
  // Build URL based on search and category filters
  if (search) {
    url = `${API_BASE_URL}/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
  } else if (category && category !== 'All') {
    url = `${API_BASE_URL}/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;
  } else {
    url = `${API_BASE_URL}?limit=${limit}&skip=${skip}`;
  }
  
  try {
    const response = await RequestMiddleware.execute({ 
      url,
      timeout: 15000,
      retries: 2
    });
    
    const data: ProductsResponse = await response.json();
    
    // Transform the raw API data to include compatibility fields
    const transformedProducts: Product[] = data.products.map(product => ({
      ...product,
      name: product.title, // Map title to name for compatibility
      image: product.thumbnail, // Use thumbnail as primary image
      featured: product.rating > 4.5, // Mark high-rated products as featured
    }));
    
    const totalPages = Math.ceil(data.total / limit);
    
    return {
      products: transformedProducts,
      totalCount: data.total,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products. Please try again later.');
  }
};

// Fetch available categories from the API
export const fetchCategories = async (): Promise<string[]> => {
  try {
    const response = await RequestMiddleware.execute({ 
      url: `${API_BASE_URL}/categories`,
      timeout: 10000,
      retries: 2
    });
    
    const categories: CategoryResponse[] = await response.json();
    
    // Transform category objects to extract just the names and add 'All' option
    const categoryNames = categories.map(cat => cat.name);
    return ['All', ...categoryNames];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return ['All', 'Electronics', 'Accessories']; // Fallback categories
  }
};
