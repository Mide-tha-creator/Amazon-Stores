"use client";

import { useCallback, useEffect, useState } from "react";

interface UseMockQueryOptions<T> {
  queryFn: () => Promise<T>;
  deps?: unknown[];
}

export function useMockQuery<T>({ queryFn, deps = [] }: UseMockQueryOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await queryFn();
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [queryFn, ...deps]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}
