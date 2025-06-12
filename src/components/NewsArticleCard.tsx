
import { Calendar, User, ArrowRight, Eye, Heart, Tag } from 'lucide-react';
import { Post } from '../services/postsApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NewsArticleCardProps {
  post: Post;
  onClick: (post: Post) => void;
  formatDate: (postId: number) => string;
  getAuthorName: (userId: number) => string;
  getPostImage: (postId: number) => string;
}

const NewsArticleCard = ({ 
  post, 
  onClick, 
  formatDate, 
  getAuthorName, 
  getPostImage 
}: NewsArticleCardProps) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
      onClick={() => onClick(post)}
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
  );
};

export default NewsArticleCard;
