import { useCallback, useEffect, useRef, useState } from "react";

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}
export function useResource<T>(loader: () => Promise<T>) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const generation = useRef(0);
  const reload = useCallback(async () => {
    const request = ++generation.current;
    setLoading(true);
    setError("");
    try {
      const value = await loader();
      if (request === generation.current) setData(value);
    } catch (failure) {
      if (request === generation.current) setError(errorMessage(failure));
    } finally {
      if (request === generation.current) setLoading(false);
    }
  }, [loader]);
  useEffect(() => {
    queueMicrotask(() => void reload());
    return () => {
      generation.current += 1;
    };
  }, [reload]);
  return { data, loading, error, reload };
}
