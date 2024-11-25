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
    const token = localStorage.getItem("auth_token");
    const headers: Record<string, string> = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return (
      (await fetchWithError(`${baseURL}/random`, {
        headers,
      })) || defaultErrorFact
    );
  };

  const voteFact = (id: number, voteType: "upvote" | "downvote") =>
    fetchWithError(`${baseURL}/facts/${id}/${voteType}`, {
      method: "POST",
    });

  const upvoteFact = (id: number) => voteFact(id, "upvote");
  const downvoteFact = (id: number) => voteFact(id, "downvote");

  const createFact = (factContent: string) =>
    fetchWithError(`${baseURL}/facts`, {
      method: "POST",
      body: { fact: factContent },
    });

  return {
    getAllFacts,
    getRandomFact,
    upvoteFact,
    downvoteFact,
    createFact,
  };
};
