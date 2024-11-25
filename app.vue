<template>
    <div class="app-container">
        <NavBar />
        <main>
            <NuxtPage />
        </main>
        <footer>
            <p>© 2024 WathisCorp</p>
        </footer>
    </div>
</template>

<script setup>
import NavBar from "~/components/layout/NavBar.vue";
import { onMounted } from "vue";
import { useAuth } from "~/composables/useAuth";

const auth = useAuth();

// Only check auth on client side
if (process.client) {
    onMounted(async () => {
        await auth.checkAuth();
    });
}
</script>

<style>
body,
html {
    margin: 0;
    padding: 0;
    height: 100%;
}

.app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

main {
    flex: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    margin-top: 80px; /* Add this line to create space below the fixed navbar */
}

footer {
    text-align: center;
    padding: 1rem;
    background: #f5f5f5;
}
</style>
