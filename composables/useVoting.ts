import { ref } from "vue";

export const useVoting = (factId: number) => {
  const hasVoted = ref<string | null>(null);
  const isVoting = ref(false);

  // Initial check for user's vote
  const checkExistingVote = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token || factId === -1) return;

      const response = await fetch(`/api/facts/${factId}/vote`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { vote_type } = await response.json();
        hasVoted.value = vote_type;
      }
    } catch (error) {
      console.error("Error checking vote:", error);
    }
  };

  const handleVote = async (voteType: string, fact: any) => {
    if (isVoting.value) return;
    isVoting.value = true;

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      let endpoint;
      if (hasVoted.value === voteType) {
        // Send the current vote type when removing
        const response = await fetch(`/api/facts/${fact.id}/remove-vote`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ voteType: hasVoted.value }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }

        const updatedFact = await response.json();
        hasVoted.value = null;
        return updatedFact;
      }

      const response = await fetch(`/api/facts/${fact.id}/${voteType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const updatedFact = await response.json();
      hasVoted.value = hasVoted.value === voteType ? null : voteType;
      return updatedFact;
    } catch (error) {
      console.error("Error voting:", error);
      throw error;
    } finally {
      isVoting.value = false;
    }
  };

  // Check existing vote when component mounts
  if (factId && factId !== -1) {
    checkExistingVote();
  }

  return {
    hasVoted,
    isVoting,
    handleVote,
  };
};
