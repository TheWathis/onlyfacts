<template>
    <div class="fact-item">
        <p class="fact-content">{{ fact.fact }}</p>

        <div class="fact-footer">
            <div class="fact-actions">
                <button
                    @click="vote('upvote')"
                    class="action-btn upvote"
                    :class="{ active: hasVoted === 'upvote' }"
                    :disabled="isVoting"
                >
                    <Icon name="mdi:thumb-up" />
                    <span>{{ fact.upvotes }}</span>
                </button>
                <button
                    @click="vote('downvote')"
                    class="action-btn downvote"
                    :class="{ active: hasVoted === 'downvote' }"
                    :disabled="isVoting"
                >
                    <Icon name="mdi:thumb-down" />
                    <span>{{ fact.downvotes }}</span>
                </button>
            </div>
            <time :datetime="fact.created_at">{{
                formatDate(fact.created_at)
            }}</time>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useVoting } from "../composables/useVoting";

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
        console.error(error);
    }
}

function formatDate(dateString) {
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
        -Math.round(
            (Date.now() - new Date(dateString)) / (1000 * 60 * 60 * 24),
        ),
        "day",
    );
}
</script>

<style scoped>
.fact-item {
    padding: 1rem 0;
    border-bottom: 1px solid #eee;
}

.fact-content {
    font-size: 1rem;
    line-height: 1.5;
    color: #1a1a1a;
    margin-bottom: 1rem;
}

.fact-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.fact-actions {
    display: flex;
    gap: 1rem;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem;
    border: none;
    background: none;
    color: #666;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 4px;
}

.action-btn:hover {
    background-color: #f0f0f0;
}

/* Upvote button styles */
.action-btn.upvote:hover {
    color: #00dc82;
}

.action-btn.upvote.active {
    color: #00dc82;
}

/* Downvote button styles */
.action-btn.downvote:hover {
    color: #e74c3c;
}

.action-btn.downvote.active {
    color: #e74c3c;
}

time {
    font-size: 0.875rem;
    color: #666;
}
</style>
