<template>
    <div class="new-fact-form">
        <textarea
            v-model="newFact"
            placeholder="Share an interesting fact..."
            rows="3"
            @keyup.esc="$emit('cancel')"
        ></textarea>

        <div class="form-footer">
            <span class="character-count">{{ newFact.length }}/255</span>
            <div class="form-actions">
                <button class="cancel-btn" @click="$emit('cancel')">
                    Cancel
                </button>
                <button
                    class="share-btn"
                    @click="submitFact"
                    :disabled="!newFact.trim()"
                >
                    Share
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const newFact = ref("");
const emit = defineEmits(["fact-added", "cancel"]);

const submitFact = async () => {
    if (!newFact.value.trim()) return;

    try {
        const response = await fetch("/api/facts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fact: newFact.value.trim() }),
        });

        if (response.ok) {
            const result = await response.json();
            emit("fact-added", result);
            newFact.value = "";
        }
    } catch (error) {
        console.error("Error adding fact:", error);
    }
};
</script>

<style scoped>
.new-fact-form {
    padding: 1rem 0;
    border-bottom: 1px solid #eee;
}

textarea {
    width: 100%;
    border: none;
    resize: none;
    padding: 0.5rem;
    font-size: 1rem;
    font-family: inherit;
    background-color: transparent;
    margin-bottom: 1rem;
}

textarea:focus {
    outline: none;
}

.form-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.character-count {
    font-size: 0.875rem;
    color: #666;
}

.form-actions {
    display: flex;
    gap: 0.5rem;
}

.cancel-btn,
.share-btn {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    border: none;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.cancel-btn {
    background-color: transparent;
    color: #666;
}

.cancel-btn:hover {
    background-color: #f0f0f0;
}

.share-btn {
    background-color: #00dc82;
    color: white;
}

.share-btn:hover {
    background-color: #00c974;
}

.share-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
