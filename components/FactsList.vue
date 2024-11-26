<template>
    <div class="facts-feed">
        <div class="feed-header">
            <button
                class="new-fact-btn"
                @click="isAddingFact = true"
                v-if="!isAddingFact"
            >
                <Icon name="mdi:plus" size="20px" />
                Share a fact
            </button>
            <AddFactForm
                v-else
                @fact-added="onFactAdded"
                @cancel="isAddingFact = false"
            />
        </div>

        <div class="feed">
            <Fact v-for="fact in facts" :key="fact.id" :fact="fact" />
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import Fact from "./Fact.vue";
import AddFactForm from "./AddFactForm.vue";

const props = defineProps({
    facts: {
        type: Array,
        required: true,
        default: () => [],
    },
});

const isAddingFact = ref(false);
const emit = defineEmits(["update:facts"]);

const onFactAdded = (newFact) => {
    emit("update:facts", [newFact, ...props.facts]);
    isAddingFact.value = false;
};
</script>

<style scoped>
.facts-feed {
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
}

.feed-header {
    position: sticky;
    top: 70px;
    z-index: 10;
    background-color: #fff;
    padding: 1rem 0;
    margin-bottom: 1rem;
}

.new-fact-btn {
    width: 100%;
    padding: 1rem;
    text-align: left;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid #eee;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
}

.new-fact-btn:hover {
    color: #00dc82;
    background-color: #f8f9fa;
}

.feed {
    display: flex;
    flex-direction: column;
}
</style>
