
import { Calendar, User, Eye, Heart, Tag } from 'lucide-react';
import { Post } from '../services/postsApi';
import { Button } from '@/components/ui/button';

interface NewsArticleDetailProps {
  post: Post;
  onBack: () => void;
  formatDate: (postId: number) => string;
  getAuthorName: (userId: number) => string;
  getPostImage: (postId: number) => string;
}

const NewsArticleDetail = ({ 
  post, 
  onBack, 
  formatDate, 
  getAuthorName, 
  getPostImage 
}: NewsArticleDetailProps) => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          ← Back to News
        </Button>
        
        <article className="bg-card rounded-xl shadow-lg overflow-hidden">
          <img
            src={getPostImage(post.id)}
            alt={post.title}
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="p-8">
            <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User size={16} />
                {getAuthorName(post.userId)}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                {formatDate(post.id)}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={16} />
                {post.views} views
              </span>
              <span className="flex items-center gap-1">
                <Heart size={16} />
                {post.reactions.likes} likes
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <span key={index} className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  <Tag size={12} />
                  {String(tag)}
                </span>
              ))}
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed">{post.body}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default NewsArticleDetail;
