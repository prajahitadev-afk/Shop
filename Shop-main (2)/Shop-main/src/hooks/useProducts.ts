import { useCallback, useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import type { Product } from "../types/product";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getProducts();
      setProducts(data ?? []);
    } catch (err) {
      console.error('Unable to load products', err);
      setError('Unable to load products right now.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    refreshProducts().then(() => {
      if (!isMounted) {
        return;
      }
    });

    return () => {
      isMounted = false;
    };
  }, [refreshProducts]);

  return {
    products,
    loading,
    error,
    refresh: refreshProducts,
  };
}
