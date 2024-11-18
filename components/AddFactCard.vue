<template>
    <div class="add-fact-card" @click="activateInput" v-if="!isEditing">
        <div class="add-icon">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <p>Add a new fact</p>
        </div>
    </div>

    <div class="add-fact-form" v-else>
        <textarea
            v-model="newFact"
            placeholder="Enter your fact (max 255 characters)"
            maxlength="255"
            @keyup.esc="cancelEdit"
        ></textarea>
        <div class="character-count">{{ newFact.length }}/255</div>
        <div class="button-group">
            <button
                class="submit-button"
                @click="submitFact"
                :disabled="!newFact.trim()"
            >
                Add Fact
            </button>
            <button class="cancel-button" @click="cancelEdit">Cancel</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const isEditing = ref(false);
const newFact = ref("");

const emit = defineEmits(["factAdded"]);

const activateInput = () => {
    isEditing.value = true;
};

const cancelEdit = () => {
    isEditing.value = false;
    newFact.value = "";
};

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
            emit("factAdded", result);
            newFact.value = "";
            isEditing.value = false;
        }
    } catch (error) {
        console.error("Error adding fact:", error);
    }
};
</script>

<style scoped>
.add-fact-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #f5f5f5;
    cursor: pointer;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.add-fact-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.add-icon {
    text-align: center;
    color: #666;
}

.add-fact-form {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: white;
    height: 200px;
    display: flex;
    flex-direction: column;
}

textarea {
    flex-grow: 1;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 10px;
    resize: none;
    font-family: inherit;
    font-size: 1.1em;
}

.character-count {
    text-align: right;
    color: #666;
    font-size: 0.9em;
    margin-bottom: 10px;
}

.button-group {
    display: flex;
    gap: 10px;
}

button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9em;
}

.submit-button {
    background-color: #2ecc71;
    color: white;
}

.submit-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.cancel-button {
    background-color: #e74c3c;
    color: white;
}

button:hover:not(:disabled) {
    transform: translateY(-1px);
}

button:disabled:hover {
    transform: none;
}
</style>
