
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';

interface NewsFilterProps {
  tags: string[];
  selectedTag: string;
  onTagChange: (tag: string) => void;
  isLoading?: boolean;
}

const NewsFilter = ({ tags, selectedTag, onTagChange, isLoading }: NewsFilterProps) => {
  const clearFilter = () => {
    onTagChange('All');
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-muted-foreground" />
          <h3 className="text-lg font-semibold">Filter by Topic</h3>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-9 w-20 bg-muted rounded-md animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-muted-foreground" />
          <h3 className="text-lg font-semibold">Filter by Topic</h3>
        </div>
        {selectedTag !== 'All' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilter}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
            Clear filter
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Button
            key={tag}
            onClick={() => onTagChange(tag)}
            variant={selectedTag === tag ? "default" : "outline"}
            size="sm"
            className="capitalize"
          >
            {tag}
          </Button>
        ))}
      </div>
      
      {selectedTag !== 'All' && (
        <div className="mt-4">
          <Badge variant="secondary" className="capitalize">
            Filtering by: {selectedTag}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default NewsFilter;
