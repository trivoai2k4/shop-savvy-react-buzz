
import { useQuery } from '@tanstack/react-query';
import { fetchPosts, fetchPostTags, PostsQueryParams } from '../services/postsApi';

export const usePosts = (params: PostsQueryParams = {}) => {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => fetchPosts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePostTags = () => {
  return useQuery({
    queryKey: ['post-tags'],
    queryFn: fetchPostTags,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
