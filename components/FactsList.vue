<template>
    <div class="facts-list">
        <FactCard v-for="fact in facts" :key="fact.id" :fact="fact" />
    </div>
</template>

<script setup>
defineProps({
    facts: {
        type: Array,
        required: true,
        default: () => [],
    },
});
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
