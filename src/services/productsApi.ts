
// Updated Product interface to match DummyJSON API structure
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
}

export interface ProductsResponse {
  products: Product[];
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
  
  console.log('Fetching products from:', url);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ProductsResponse = await response.json();
    
    // Transform the data to match our expected format
    const transformedProducts = data.products.map(product => ({
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
    const response = await fetch(`${API_BASE_URL}/categories`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const categories: string[] = await response.json();
    return ['All', ...categories];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return ['All', 'Electronics', 'Accessories']; // Fallback categories
  }
};
