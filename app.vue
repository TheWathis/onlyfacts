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
        const script = document.createElement("script");
        script.async = true;
        script.defer = true;
        script.src = "https://umami.wathis.com/script.js";
        script.setAttribute(
            "data-website-id",
            "5cfefc3c-09cf-4405-a1a5-3ff27b86d3fa",
        );
        document.head.appendChild(script);
        document.title = "TheOnlyFacts";

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
    display: flex;
    flex: 1;
    max-width: 1200px;
    margin: 70px auto 0 auto;
}

footer {
    text-align: center;
    padding: 1rem;
    background: #f5f5f5;
}

@media (max-width: 768px) {
    main {
        margin: 70px 1em 0 1em;
    }
}
</style>
