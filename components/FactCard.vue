<template>
    <div class="fact-card">
        <p class="fact-text">{{ fact.fact }}</p>
        <div class="fact-meta">
            <div class="vote-buttons">
                <button
                    @click="vote('upvote')"
                    class="vote-btn upvote"
                    :class="{ active: hasVoted === 'upvote' }"
                    :disabled="hasVoted || fact.id === -1"
                >
                    <Icon name="mdi:thumb-up" />
                    <span>{{ fact.upvotes }}</span>
                </button>
                <button
                    @click="vote('downvote')"
                    class="vote-btn downvote"
                    :class="{ active: hasVoted === 'downvote' }"
                    :disabled="hasVoted || fact.id === -1"
                >
                    <Icon name="mdi:thumb-down" />
                    <span>{{ fact.downvotes }}</span>
                </button>
            </div>
            <span class="fact-date">{{ formatDate(fact.created_at) }}</span>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
    fact: {
        type: Object,
        required: true,
    },
});

const fact = ref(props.fact);
const hasVoted = ref(null);
const userId = ref(null);

onMounted(async () => {
    // Initialize userId
    let storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
        storedUserId = "user_" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("userId", storedUserId);
    }
    userId.value = storedUserId;

    // Check if user has already voted on this fact
    const voted = localStorage.getItem(`fact_vote_${fact.value.id}`);
    if (voted) {
        hasVoted.value = voted;
    }
});

async function vote(voteType) {
    if (hasVoted.value) return;

    try {
        const response = await fetch(
            `/api/facts/${fact.value.id}/${voteType}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId.value,
                }),
            },
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        const updatedFact = await response.json();
        fact.value = { ...fact.value, ...updatedFact };
        hasVoted.value = voteType;
        localStorage.setItem(`fact_vote_${fact.value.id}`, voteType);
    } catch (error) {
        console.error("Error voting:", error);
        // Add user feedback here if needed
    }
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}
</script>

<style scoped>
.fact-card {
    --upvote-color: #2ecc71;
    --downvote-color: #e74c3c;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    min-height: 200px; /* Match the height of AddFactCard */
}

.fact-text {
    font-size: 1.1em;
    margin-bottom: 15px;
    flex: 1; /* This will push the meta section to the bottom */
}

.fact-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #666;
    font-size: 0.9em;
    margin-top: auto; /* Ensures it stays at the bottom */
}

.vote-buttons {
    display: flex;
    gap: 10px;
}

.vote-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    background-color: #f5f5f5;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9em;
}

.vote-btn:hover {
    transform: translateY(-1px);
}

.vote-btn.upvote {
    color: var(--upvote-color);
}

.vote-btn.upvote:hover,
.vote-btn.upvote.active {
    background-color: var(--upvote-color);
    color: white;
}

.vote-btn.downvote {
    color: var(--downvote-color);
}

.vote-btn.downvote:hover,
.vote-btn.downvote.active {
    background-color: var(--downvote-color);
    color: white;
}

.vote-btn .icon {
    width: 20px;
    height: 20px;
}

.fact-date {
    font-style: italic;
}

.vote-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.vote-btn.upvote:disabled:hover {
    background-color: #f5f5f5; /* Keep original background */
    color: var(--upvote-color); /* Keep original text color */
}
.vote-btn.downvote:disabled:hover {
    background-color: #f5f5f5; /* Keep original background */
    color: var(--downvote-color); /* Keep original text color */
}

.vote-btn.upvote.active:disabled {
    opacity: 1;
    background-color: var(--upvote-color);
    color: white !important;
}

.vote-btn.downvote.active:disabled {
    opacity: 1;
    background-color: var(--downvote-color);
    color: white !important;
}
</style>
