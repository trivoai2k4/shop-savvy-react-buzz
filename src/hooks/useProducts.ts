
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, ProductsQueryParams } from '../services/productsApi';

export const useProducts = (params: ProductsQueryParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => fetchProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
