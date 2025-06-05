
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck } from 'lucide-react';
import { useAppDispatch } from '../hooks/redux';
import { addToCart } from '../store/cartSlice';
import { useProducts } from '../hooks/useProducts';

const Home = () => {
  const dispatch = useAppDispatch();
  
  // Fetch products to show featured ones
  const { data, isLoading } = useProducts({ limit: 20 }); // Get more products to filter featured ones
  
  const featuredProducts = data?.products.filter(product => product.featured).slice(0, 6) || [];

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name || product.title,
      price: product.price,
      image: product.image || product.thumbnail,
    }));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Welcome to EcoStore
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Discover premium products with sustainable quality and modern design
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105"
            >
              Shop Now
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Carefully curated products that meet the highest standards</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
              <p className="text-gray-600">Your data and payments are protected with bank-level security</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable shipping to your doorstep</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600">
              Discover our most popular items
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading featured products...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
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
                      {product.rating && (
                        <div className="flex items-center">
                          <span className="text-yellow-500">★</span>
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
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200"
            >
              View All Products
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
