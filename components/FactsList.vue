<template>
    <div class="facts-feed">
        <div class="feed">
            <Fact v-for="fact in facts" :key="fact.id" :fact="fact" />
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import Fact from "./Fact.vue";

const props = defineProps({
    facts: {
        type: Array,
        required: true,
        default: () => [],
    },
});
</script>

<style scoped>
.facts-feed {
    margin: 0 auto;
    padding: 1rem;
}

.feed {
    display: flex;
    flex-direction: column;
}
</style>
