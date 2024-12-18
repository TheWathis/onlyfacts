<template>
    <div class="home-container">
        <div class="hero-section">
            <div class="fact-container" :class="{ loading: isLoading }">
                <div class="fact-content">
                    <div class="quote-wrapper">
                        <span class="quote-mark left">"</span>
                        <p class="fact-text">
                            {{ fact?.fact || "Loading a fact" }}
                        </p>
                        <span class="quote-mark right">"</span>
                    </div>
                </div>
                <div class="fact-actions">
                    <div class="vote-buttons" v-if="auth.state.isAuthenticated">
                        <button
                            @click="vote('upvote')"
                            class="vote-button upvote"
                            :class="{ active: hasVoted === 'upvote' }"
                            :disabled="isVoting"
                            data-umami-event="upvote-fact"
                        >
                            <Icon name="mdi:thumb-up" />
                            <span>{{ fact?.upvotes }}</span>
                        </button>
                        <button
                            @click="vote('downvote')"
                            class="vote-button downvote"
                            :class="{ active: hasVoted === 'downvote' }"
                            :disabled="isVoting"
                            data-umami-event="downvote-fact"
                        >
                            <Icon name="mdi:thumb-down" />
                            <span>{{ fact?.downvotes }}</span>
                        </button>
                    </div>
                    <button
                        class="random-button"
                        @click="loadNewFact"
                        data-umami-event="new-fact"
                    >
                        Random Fact
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useAuth } from "~/composables/useAuth";
import { useVoting } from "~/composables/useVoting";

const { getRandomFact } = useFacts();
const fact = ref(null);
const isLoading = ref(true);
const auth = useAuth();

// Voting state
const hasVoted = ref(null);
const isVoting = ref(false);

// Check existing vote when fact changes
async function checkExistingVote() {
    if (!fact.value?.id || !auth.state.isAuthenticated) return;

    try {
        const response = await fetch(`/api/facts/${fact.value.id}/vote`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
        });

        if (response.ok) {
            const { vote_type } = await response.json();
            hasVoted.value = vote_type;
        }
    } catch (error) {
        console.error("Error checking vote:", error);
    }
}

async function loadNewFact() {
    isLoading.value = true;
    fact.value = await getRandomFact();
    await checkExistingVote(); // Check for existing vote when loading new fact
    isLoading.value = false;
}

async function vote(voteType) {
    if (isVoting.value) return;
    isVoting.value = true;

    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("Not authenticated");
        }

        let endpoint;
        if (hasVoted.value === voteType) {
            // Remove vote
            const response = await fetch(
                `/api/facts/${fact.value.id}/remove-vote`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ voteType: hasVoted.value }),
                },
            );

            if (!response.ok) {
                throw new Error("Failed to remove vote");
            }

            const updatedFact = await response.json();
            fact.value = updatedFact;
            hasVoted.value = null;
        } else {
            // Add or change vote
            const response = await fetch(
                `/api/facts/${fact.value.id}/${voteType}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (!response.ok) {
                throw new Error("Failed to vote");
            }

            const updatedFact = await response.json();
            fact.value = updatedFact;
            hasVoted.value = voteType;
        }
    } catch (error) {
        console.error("Error voting:", error);
    } finally {
        isVoting.value = false;
    }
}

// Watch for auth state changes
watch(
    () => auth.state.isAuthenticated,
    (isAuthenticated) => {
        if (isAuthenticated && fact.value) {
            checkExistingVote();
        } else {
            hasVoted.value = null;
        }
    },
);

// Initial load
loadNewFact();
</script>

<style scoped>
.home-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4rem;
    padding: 2rem 0;
}

.hero-section {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
}

.fact-container {
    max-width: 800px;
    text-align: center;
    transition: opacity 0.3s ease;
}

.fact-container.loading {
    opacity: 0.5;
}

.fact-content {
    position: relative;
    margin-bottom: 2rem;
    padding: 2rem;
}

.quote-wrapper {
    position: relative;
    display: inline-block; /* This will make it wrap around the content */
}

.quote-mark {
    font-size: 4rem;
    color: #00dc82;
    opacity: 0.3;
    font-family: Georgia, serif;
    position: absolute;
    line-height: 1;
}

.quote-mark.left {
    top: -1rem;
    left: -2rem;
}

.quote-mark.right {
    top: -1rem;
    right: -2rem;
}

.fact-text {
    font-size: 1.8rem;
    line-height: 1.5;
    color: #2c3e50;
    margin: 0;
    padding: 0 2rem;
    position: relative;
}

.fact-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    margin-top: 2rem;
}

.vote-buttons {
    display: flex;
    gap: 1rem;
}

.vote-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 8px;
    background-color: #f5f5f5;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s ease;
}

.vote-button.upvote {
    color: #2ecc71;
}

.vote-button.upvote:hover,
.vote-button.upvote.active {
    background-color: #2ecc71;
    color: white;
}

.vote-button.downvote {
    color: #e74c3c;
}

.vote-button.downvote:hover,
.vote-button.downvote.active {
    background-color: #e74c3c;
    color: white;
}

.vote-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.random-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 8px;
    background-color: #f5f5f5;
    color: #00dc82;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.2s ease;
}

.random-button:hover {
    background-color: #00dc82;
    color: white;
}

.content-section {
    text-align: center;
    padding: 2rem;
}

@media (max-width: 768px) {
    .fact-content {
        padding: 1.5rem;
    }

    .fact-text {
        font-size: 1.4rem;
        padding: unset;
    }

    .quote-mark {
        font-size: 3rem;
    }

    .quote-mark:first-child {
        top: -0.8rem;
        left: -1.5rem;
    }

    .quote-mark:last-child {
        top: -0.8rem;
        right: -1.5rem;
    }

    .fact-actions {
        flex-direction: column;
        gap: 1rem;
    }
}
</style>
