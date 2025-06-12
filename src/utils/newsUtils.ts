
export const formatDate = (postId: number) => {
  // Generate a consistent date based on post ID
  const baseDate = new Date('2024-01-01');
  baseDate.setDate(baseDate.getDate() + (postId % 30));
  return baseDate.toLocaleDateString();
};

export const getAuthorName = (userId: number) => {
  const authors = ['Sarah Johnson', 'Mike Chen', 'Emma Davis', 'David Wilson', 'Alex Rivera', 'Lisa Park'];
  return authors[userId % authors.length];
};

export const getPostImage = (postId: number) => {
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
