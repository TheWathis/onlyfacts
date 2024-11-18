<template>
    <div class="container">
        <h1>Random Fact</h1>
        <div class="card-wrapper">
            <FactCard v-if="fact" :fact="fact" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useFacts } from "~/composables/useFacts";
import FactCard from "~/components/FactCard.vue";

const { getRandomFact } = useFacts();
const fact = ref(null);

onMounted(async () => {
    fact.value = await getRandomFact();
});
</script>

<style scoped>
.container {
    text-align: center;
}

.card-wrapper {
    max-width: 800px;
    min-width: 300px;
    margin: 0 auto;
    width: 100%;
    padding: 0 1rem;
}

@media (max-width: 768px) {
    .card-wrapper {
        width: 100%;
        padding: 0 0.5rem;
    }
}
</style>
