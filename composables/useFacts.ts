export const useFacts = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase;

  const getAllFacts = async () => {
    try {
      const facts = await $fetch(`${baseURL}/facts`);
      return facts;
    } catch (error) {
      console.error("Error fetching facts:", error);
      return [];
    }
  };

  const getRandomFact = async () => {
    try {
      const fact = await $fetch(`${baseURL}/random`);
      return fact;
    } catch (error) {
      console.error("Error fetching random fact:", error);
      return null;
    }
  };

  const upvoteFact = async (id) => {
    try {
      const updatedFact = await $fetch(`${baseURL}/facts/${id}/upvote`, {
        method: "POST",
      });
      return updatedFact;
    } catch (error) {
      console.error("Error upvoting fact:", error);
      return null;
    }
  };

  const downvoteFact = async (id) => {
    try {
      const updatedFact = await $fetch(`${baseURL}/facts/${id}/downvote`, {
        method: "POST",
      });
      return updatedFact;
    } catch (error) {
      console.error("Error downvoting fact:", error);
      return null;
    }
  };

  const createFact = async (factContent) => {
    try {
      const newFact = await $fetch(`${baseURL}/facts`, {
        method: "POST",
        body: { fact: factContent },
      });
      return newFact;
    } catch (error) {
      console.error("Error creating fact:", error);
      return null;
    }
  };

  return {
    getAllFacts,
    getRandomFact,
    upvoteFact,
    downvoteFact,
    createFact,
  };
};
