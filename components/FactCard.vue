<template>
    <div class="fact-card">
        <p class="fact-text">{{ fact.fact }}</p>
        <div class="fact-meta">
            <div class="vote-buttons">
                <VoteButton
                    type="upvote"
                    :isActive="hasVoted === 'upvote'"
                    :disabled="fact.id === -1"
                    :isVoting="isVoting"
                    :count="fact.upvotes"
                    @vote="vote('upvote')"
                />
                <VoteButton
                    type="downvote"
                    :isActive="hasVoted === 'downvote'"
                    :disabled="fact.id === -1"
                    :isVoting="isVoting"
                    :count="fact.downvotes"
                    @vote="vote('downvote')"
                />
            </div>
            <span class="fact-date">{{ formatDate(fact.created_at) }}</span>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useVoting } from "../composables/useVoting";
import VoteButton from "./VoteButton.vue";

const props = defineProps({
    fact: {
        type: Object,
        required: true,
    },
});

const fact = ref(props.fact);
const { hasVoted, isVoting, handleVote } = useVoting(fact.value.id);

async function vote(voteType) {
    try {
        const updatedFact = await handleVote(voteType, fact.value);
        if (updatedFact) {
            fact.value = updatedFact;
        }
    } catch (error) {
        // Handle error (maybe show a notification)
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
    min-height: 200px;
}

.fact-text {
    font-size: 1.1em;
    margin-bottom: 15px;
    flex: 1;
}

.fact-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #666;
    font-size: 0.9em;
    margin-top: auto;
}

.vote-buttons {
    display: flex;
    gap: 10px;
}

.fact-date {
    font-style: italic;
}
</style>
