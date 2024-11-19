import { ref, watch } from "vue";

export const useVoting = (factId: number) => {
  const userId = ref<string | null>(null);
  const hasVoted = ref<string | null>(null);
  const isVoting = ref(false);

  const initializeUserId = () => {
    let storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      storedUserId = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("userId", storedUserId);
    }
    userId.value = storedUserId;
  };

  const checkExistingVote = (id: number) => {
    const voted = localStorage.getItem(`fact_vote_${id}`);
    if (voted) {
      hasVoted.value = voted;
    }
  };

  const resetVoting = (newFactId: number) => {
    hasVoted.value = null;
    checkExistingVote(newFactId);
  };

  const handleVote = async (voteType: string, fact: any) => {
    if (isVoting.value) return;
    isVoting.value = true;

    try {
      if (hasVoted.value) {
        if (hasVoted.value === voteType) {
          const removeVoteResponse = await fetch(
            `/api/facts/${fact.id}/remove-vote`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: userId.value,
                voteType: hasVoted.value,
              }),
            },
          );

          if (!removeVoteResponse.ok) {
            const error = await removeVoteResponse.json();
            throw new Error(error.message);
          }

          const updatedFact = await removeVoteResponse.json();
          hasVoted.value = null;
          localStorage.removeItem(`fact_vote_${fact.id}`);
          return updatedFact;
        }

        await fetch(`/api/facts/${fact.id}/remove-vote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId.value,
            voteType: hasVoted.value,
          }),
        });
      }

      const response = await fetch(`/api/facts/${fact.id}/${voteType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId.value }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const updatedFact = await response.json();
      hasVoted.value = voteType;
      localStorage.setItem(`fact_vote_${fact.id}`, voteType);
      return updatedFact;
    } catch (error) {
      console.error("Error voting:", error);
      throw error;
    } finally {
      isVoting.value = false;
    }
  };

  // Initialize on creation
  initializeUserId();
  if (factId && factId !== -1) {
    checkExistingVote(factId);
  }

  return {
    userId,
    hasVoted,
    isVoting,
    handleVote,
    resetVoting,
  };
};
