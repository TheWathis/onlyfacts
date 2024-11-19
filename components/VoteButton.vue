<template>
    <button
        @click="$emit('vote')"
        class="vote-btn"
        :class="[type, { active: isActive }]"
        :disabled="disabled || isVoting"
    >
        <Icon :name="iconName" />
        <span>{{ count }}</span>
    </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    type: {
        type: String,
        required: true,
        validator: (value) => ["upvote", "downvote"].includes(value),
    },
    isActive: Boolean,
    disabled: Boolean,
    isVoting: Boolean,
    count: Number,
});

const iconName = computed(() =>
    props.type === "upvote" ? "mdi:thumb-up" : "mdi:thumb-down",
);
</script>

<style scoped>
.vote-btn {
    --upvote-color: #2ecc71;
    --downvote-color: #e74c3c;
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

.vote-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.vote-btn.upvote:disabled:hover {
    background-color: #f5f5f5;
    color: var(--upvote-color);
}

.vote-btn.downvote:disabled:hover {
    background-color: #f5f5f5;
    color: var(--downvote-color);
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
