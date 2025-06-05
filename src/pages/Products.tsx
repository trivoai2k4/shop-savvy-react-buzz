
import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useAppDispatch } from '../hooks/redux';
import { addToCart } from '../store/cartSlice';
import { useProducts } from '../hooks/useProducts';
import { fetchCategories } from '../services/productsApi';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis 
} from '../components/ui/pagination';

const Products = () => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState(['All']);
  const limit = 6;

  const { data, isLoading, error } = useProducts({
    page: currentPage,
    limit,
    search: searchTerm,
    category: selectedCategory,
  });

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryList = await fetchCategories();
        setCategories(categoryList);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    
    loadCategories();
  }, []);

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name || product.title,
      price: product.price,
      image: product.image || product.thumbnail,
    }));
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const renderPaginationItems = () => {
    if (!data) return null;

    const { totalPages, currentPage: current } = data;
    const items = [];

    if (current > 1) {
      items.push(
        <PaginationItem key="prev">
          <PaginationPrevious 
            onClick={() => setCurrentPage(current - 1)}
            className="cursor-pointer"
          />
        </PaginationItem>
      );
    }

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= current - 1 && i <= current + 1)) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => setCurrentPage(i)}
              isActive={i === current}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (i === current - 2 || i === current + 2) {
        items.push(
          <PaginationItem key={`ellipsis-${i}`}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    if (current < totalPages) {
      items.push(
        <PaginationItem key="next">
          <PaginationNext 
            onClick={() => setCurrentPage(current + 1)}
            className="cursor-pointer"
          />
        </PaginationItem>
      );
    }

    return items;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-xl text-red-500 mb-4">Error loading products</p>
            <p className="text-gray-600">{error.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our Products
          </h1>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 capitalize ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results info */}
          {data && (
            <div className="mb-4">
              <p className="text-gray-600">
                Showing {data.products.length} of {data.totalCount} products
                {searchTerm && ` for "${searchTerm}"`}
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading products...</span>
          </div>
        )}

        {/* Products Grid */}
        {data && data.products.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {data.products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="aspect-w-1 aspect-h-1">
                    <img
                      src={product.image || product.thumbnail}
                      alt={product.name || product.title}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full capitalize">
                        {product.category}
                      </span>
                      {product.featured && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                          Featured
                        </span>
                      )}
                      {product.rating && (
                        <div className="flex items-center">
                          <span className="text-yellow-500 text-sm">★</span>
                          <span className="text-sm text-gray-600 ml-1">{product.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {product.name || product.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-blue-600">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.discountPercentage > 0 && (
                          <span className="text-sm text-green-600">
                            {product.discountPercentage.toFixed(0)}% off
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold"
                      >
                        Add to Cart
                      </button>
                    </div>
                    {product.stock && (
                      <p className="text-sm text-gray-500 mt-2">
                        {product.stock} in stock
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  {renderPaginationItems()}
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}

        {/* No Results */}
        {data && data.products.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No products found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setCurrentPage(1);
              }}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
