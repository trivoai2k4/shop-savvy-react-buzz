
import { useEffect, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { fetchProducts, fetchCategories, clearCache } from '../store/productsSlice';
import { ProductsQueryParams } from '../services/productsApi';

export const useProductsRedux = (params: ProductsQueryParams) => {
  const dispatch = useAppDispatch();
  
  // Memoize selectors for better performance
  const productsState = useAppSelector((state) => state.products);
  
  const memoizedData = useMemo(() => ({
    products: productsState.items,
    currentPage: productsState.currentPage,
    totalPages: productsState.totalPages,
    totalCount: productsState.totalCount,
  }), [
    productsState.items,
    productsState.currentPage,
    productsState.totalPages,
    productsState.totalCount,
  ]);

  // Memoize params to prevent unnecessary re-renders
  const memoizedParams = useMemo(() => params, [JSON.stringify(params)]);

  const refetch = useCallback(() => {
    dispatch(clearCache());
    dispatch(fetchProducts(memoizedParams));
  }, [dispatch, memoizedParams]);

  useEffect(() => {
    dispatch(fetchProducts(memoizedParams));
  }, [dispatch, memoizedParams]);

  return {
    data: memoizedData,
    isLoading: productsState.loading,
    error: productsState.error ? new Error(productsState.error) : null,
    refetch,
  };
};

export const useCategoriesRedux = () => {
  const dispatch = useAppDispatch();
  
  // Memoize categories selector
  const categories = useAppSelector((state) => state.products.categories);
  const loading = useAppSelector((state) => state.products.loading);
  const error = useAppSelector((state) => state.products.error);

  const refetch = useCallback(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categories.length <= 1) { // Only 'All' category exists
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  return {
    data: categories,
    isLoading: loading,
    error: error ? new Error(error) : null,
    refetch,
  };
};
