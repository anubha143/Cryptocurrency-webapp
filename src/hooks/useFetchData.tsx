import { useState, useEffect } from "react";

const useFetchData = (url: string, id?: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchData = async () => {
    try {
      // setLoading(true);
      const finalUrl = id ? `${url}/${id}` : url;
      const response: Response = await fetch(finalUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setData(result?.data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, setData, fetchData };
};

export default useFetchData;
