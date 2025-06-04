
import { useState } from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
}

const mockArticles: NewsArticle[] = [
  {
    id: 1,
    title: "The Future of Sustainable Technology",
    excerpt: "Exploring how modern technology can help build a more sustainable future for everyone.",
    content: "Technology continues to evolve at an unprecedented pace, and with it comes the opportunity to create more sustainable solutions...",
    author: "Sarah Johnson",
    date: "2024-01-15",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
    category: "Technology"
  },
  {
    id: 2,
    title: "New Product Launch: Smart Home Collection",
    excerpt: "Introducing our latest smart home devices designed to make your life easier and more efficient.",
    content: "We're excited to announce the launch of our new smart home collection, featuring innovative devices...",
    author: "Mike Chen",
    date: "2024-01-10",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
    category: "Products"
  },
  {
    id: 3,
    title: "Customer Spotlight: Success Stories",
    excerpt: "Hear from our customers about how our products have transformed their daily routines.",
    content: "Our customers are at the heart of everything we do. Here are some inspiring stories...",
    author: "Emma Davis",
    date: "2024-01-05",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
    category: "Community"
  },
  {
    id: 4,
    title: "Industry Trends: What to Expect in 2024",
    excerpt: "Our analysis of the latest trends shaping the e-commerce and technology landscape.",
    content: "As we move forward into 2024, several key trends are emerging that will shape our industry...",
    author: "David Wilson",
    date: "2024-01-01",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    category: "Industry"
  },
];

const News = () => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Technology', 'Products', 'Community', 'Industry'];

  const filteredArticles = selectedCategory === 'All' 
    ? mockArticles 
    : mockArticles.filter(article => article.category === selectedCategory);

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedArticle(null)}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to News
          </button>
          
          <article className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="p-8">
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <User size={16} />
                  {selectedArticle.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {new Date(selectedArticle.date).toLocaleDateString()}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {selectedArticle.category}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {selectedArticle.title}
              </h1>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-600 mb-6">{selectedArticle.excerpt}</p>
                <p className="text-gray-700 leading-relaxed">{selectedArticle.content}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Latest News & Updates
          </h1>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
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

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {article.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(article.date).toLocaleDateString()}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {article.title}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <User size={14} />
                    {article.author}
                  </span>
                  <span className="text-blue-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                    Read More
                    <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No articles found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
