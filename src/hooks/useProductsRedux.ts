
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { fetchProducts, fetchCategories } from '../store/productsSlice';
import { ProductsQueryParams } from '../services/productsApi';

export const useProductsRedux = (params: ProductsQueryParams) => {
  const dispatch = useAppDispatch();
  const { items, loading, error, currentPage, totalPages, totalCount } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts(params));
  }, [dispatch, JSON.stringify(params)]);

  return {
    data: {
      products: items,
      currentPage,
      totalPages,
      totalCount,
    },
    isLoading: loading,
    error: error ? new Error(error) : null,
  };
};

export const useCategoriesRedux = () => {
  const dispatch = useAppDispatch();
  const { categories, loading, error } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (categories.length <= 1) { // Only 'All' category exists
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  return {
    data: categories,
    isLoading: loading,
    error: error ? new Error(error) : null,
  };
};
