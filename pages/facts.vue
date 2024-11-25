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
import { useAuth } from "~/composables/useAuth";
import { useRouter } from "vue-router";

const { getAllFacts } = useFacts();
const facts = ref([]);
const auth = useAuth();
const router = useRouter();

onMounted(async () => {
    // Redirect if not authenticated
    if (!auth.state.isAuthenticated) {
        router.push("/auth");
        return;
    }
    facts.value = await getAllFacts();
});
</script>
