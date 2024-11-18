<template>
    <div class="facts-list">
        <AddFactCard @factAdded="onFactAdded" />
        <FactCard v-for="fact in facts" :key="fact.id" :fact="fact" />
    </div>
</template>

<script setup>
import AddFactCard from "./AddFactCard.vue";

const props = defineProps({
    facts: {
        type: Array,
        required: true,
        default: () => [],
    },
});

const emit = defineEmits(["update:facts"]);

const onFactAdded = (newFact) => {
    emit("update:facts", [newFact, ...props.facts]);
};
</script>

<style scoped>
.facts-list {
    display: grid;
    grid-template-columns: 1fr; /* Default 1 column for mobile */
    gap: 20px;
    padding: 20px;
}

/* Desktop layout (screens wider than 768px) */
@media (min-width: 768px) {
    .facts-list {
        grid-template-columns: repeat(3, 1fr); /* 3 columns for desktop */
    }
}
</style>
