export const useFacts = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase;

  const defaultErrorFact = {
    id: -1,
    fact: "Sorry, our fact server seems to be down at the moment. Please try again later!",
    upvotes: 0,
    downvotes: 0,
    created_at: new Date().toISOString(),
  };

  const fetchWithError = async (url: string, options = {}) => {
    try {
      return await $fetch(url, options);
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      return null;
    }
  };

  const getAllFacts = () => fetchWithError(`${baseURL}/facts`) || [];

  const getRandomFact = async () => {
    const headers: Record<string, string> = {};

    if (process.client) {
      const token = localStorage.getItem("auth_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return (
      (await fetchWithError(`${baseURL}/random`, {
        headers,
      })) || defaultErrorFact
    );
  };

  const createFact = (factContent: string) => {
    const headers: Record<string, string> = {};

    if (process.client) {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Authentication required to create a fact");
      }
      headers["Authorization"] = `Bearer ${token}`;
    }

    return fetchWithError(`${baseURL}/facts`, {
      headers,
      method: "POST",
      body: { fact: factContent },
    });
  };

  return {
    getAllFacts,
    getRandomFact,
    createFact,
  };
};
