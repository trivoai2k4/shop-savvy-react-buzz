
import { useState } from 'react';
import { Calendar, User, ArrowRight, Eye, Heart, Tag } from 'lucide-react';
import { usePosts, usePostTags } from '../hooks/usePosts';
import { Post } from '../services/postsApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const News = () => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedTag, setSelectedTag] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  const { data: postsData, isLoading: postsLoading, error: postsError } = usePosts({
    limit: postsPerPage,
    skip: (currentPage - 1) * postsPerPage,
    tag: selectedTag === 'All' ? undefined : selectedTag,
  });

  const { data: tags = [], isLoading: tagsLoading } = usePostTags();

  // Ensure tags are always strings
  const allTags = ['All', ...tags.slice(0, 10).map(tag => typeof tag === 'string' ? tag : String(tag))];

  const totalPages = postsData ? Math.ceil(postsData.total / postsPerPage) : 1;

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  const formatDate = (postId: number) => {
    // Generate a consistent date based on post ID
    const baseDate = new Date('2024-01-01');
    baseDate.setDate(baseDate.getDate() + (postId % 30));
    return baseDate.toLocaleDateString();
  };

  const getAuthorName = (userId: number) => {
    const authors = ['Sarah Johnson', 'Mike Chen', 'Emma Davis', 'David Wilson', 'Alex Rivera', 'Lisa Park'];
    return authors[userId % authors.length];
  };

  const getPostImage = (postId: number) => {
    const images = [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1486312338219-ce68e2c6b3ca?w=800&h=400&fit=crop',
    ];
    return images[postId % images.length];
  };

  if (postsLoading && !postsData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading latest news...</p>
        </div>
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading News</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Failed to load news articles. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => setSelectedPost(null)}
            className="mb-6"
          >
            ← Back to News
          </Button>
          
          <article className="bg-card rounded-xl shadow-lg overflow-hidden">
            <img
              src={getPostImage(selectedPost.id)}
              alt={selectedPost.title}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="p-8">
              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User size={16} />
                  {getAuthorName(selectedPost.userId)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {formatDate(selectedPost.id)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={16} />
                  {selectedPost.views} views
                </span>
                <span className="flex items-center gap-1">
                  <Heart size={16} />
                  {selectedPost.reactions.likes} likes
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {selectedPost.title}
              </h1>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedPost.tags.map((tag, index) => (
                  <span key={index} className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    <Tag size={12} />
                    {String(tag)}
                  </span>
                ))}
              </div>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">{selectedPost.body}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Latest News & Updates
          </h1>
          
          {/* Tag Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tagsLoading ? (
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 w-20 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              allTags.map((tag) => (
                <Button
                  key={tag}
                  onClick={() => handleTagChange(tag)}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  className="capitalize"
                >
                  {String(tag)}
                </Button>
              ))
            )}
          </div>
          
          {/* Show current filter */}
          {selectedTag !== 'All' && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Showing posts tagged with: <span className="font-medium text-primary">{selectedTag}</span>
              </p>
            </div>
          )}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {postsData?.posts.map((post) => (
            <Card
              key={post.id}
              className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => setSelectedPost(post)}
            >
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img
                  src={getPostImage(post.id)}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  {post.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full capitalize">
                      {String(tag)}
                    </span>
                  ))}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {formatDate(post.id)}
                  </span>
                </div>
                
                <CardTitle className="text-lg line-clamp-2">
                  {post.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {post.body}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {getAuthorName(post.userId)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      {post.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={12} />
                      {post.reactions.likes}
                    </span>
                  </div>
                  <span className="text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all text-sm">
                    Read More
                    <ArrowRight size={14} />
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {postsData?.posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No articles found for the selected tag.</p>
            <Button
              variant="outline"
              onClick={() => handleTagChange('All')}
              className="mt-4"
            >
              Show All Posts
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
