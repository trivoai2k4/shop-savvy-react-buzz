import { useState } from 'react';
import { usePosts, usePostTags } from '../hooks/usePosts';
import { Post } from '../services/postsApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NewsFilter from '../components/NewsFilter';
import NewsArticleCard from '../components/NewsArticleCard';
import NewsArticleDetail from '../components/NewsArticleDetail';
import NewsPagination from '../components/NewsPagination';
import { formatDate, getAuthorName, getPostImage } from '../utils/newsUtils';

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

  const { data: tagsData = [], isLoading: tagsLoading } = usePostTags();

  // Fix tag processing - ensure we get clean string tags
  const processedTags = Array.isArray(tagsData) 
    ? tagsData.slice(0, 10).filter(tag => typeof tag === 'string' && tag.trim() !== '')
    : [];
  const allTags = ['All', ...processedTags];

  console.log('Raw tags data:', tagsData);
  console.log('Processed tags:', processedTags);
  console.log('All tags for filter:', allTags);

  const totalPages = postsData ? Math.ceil(postsData.total / postsPerPage) : 1;

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    setCurrentPage(1);
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
      <NewsArticleDetail
        post={selectedPost}
        onBack={() => setSelectedPost(null)}
        formatDate={formatDate}
        getAuthorName={getAuthorName}
        getPostImage={getPostImage}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Latest News & Updates
          </h1>
          
          <NewsFilter
            tags={allTags}
            selectedTag={selectedTag}
            onTagChange={handleTagChange}
            isLoading={tagsLoading}
          />
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {postsData?.posts.map((post) => (
            <NewsArticleCard
              key={post.id}
              post={post}
              onClick={setSelectedPost}
              formatDate={formatDate}
              getAuthorName={getAuthorName}
              getPostImage={getPostImage}
            />
          ))}
        </div>

        {/* Pagination */}
        <NewsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

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
