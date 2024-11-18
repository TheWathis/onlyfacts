<template>
    <div>
        <h1>Every of our Facts</h1>
        <FactsList :facts="facts" />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useFacts } from "~/composables/useFacts";
import FactsList from "~/components/FactsList.vue";

const { getAllFacts } = useFacts();
const facts = ref([]);

onMounted(async () => {
    facts.value = await getAllFacts();
});
</script>
