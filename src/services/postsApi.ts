
import RequestMiddleware from '../middleware/requestMiddleware';

export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

export interface PostsQueryParams {
  limit?: number;
  skip?: number;
  tag?: string;
}

const BASE_URL = 'https://dummyjson.com';

export const fetchPosts = async (params: PostsQueryParams = {}): Promise<PostsResponse> => {
  const { limit = 20, skip = 0, tag } = params;
  
  let url = `${BASE_URL}/posts?limit=${limit}&skip=${skip}`;
  if (tag && tag !== 'All') {
    url = `${BASE_URL}/posts/tag/${tag}?limit=${limit}&skip=${skip}`;
  }

  const response = await RequestMiddleware.execute({ url });
  return response.json();
};

export const fetchPostTags = async (): Promise<string[]> => {
  const response = await RequestMiddleware.execute({ 
    url: `${BASE_URL}/posts/tags` 
  });
  return response.json();
};
