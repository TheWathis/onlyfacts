<template>
    <nav class="navbar">
        <div class="nav-content">
            <div class="nav-brand">
                <NuxtLink to="/" class="brand-link">
                    <h1>OnlyFacts</h1>
                </NuxtLink>
            </div>
            <div class="nav-links">
                <NuxtLink to="/" class="nav-link">Home</NuxtLink>
                <!-- Show either Login or Username + Logout -->
                <template v-if="auth.state.isAuthenticated">
                    <NuxtLink to="/profile" class="nav-link">
                        {{ auth.state.user?.username }}
                    </NuxtLink>
                    <button @click="handleLogout" class="logout-btn">
                        Logout
                    </button>
                </template>
                <template v-else>
                    <NuxtLink to="/auth" class="nav-link">Login</NuxtLink>
                </template>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { useAuth } from "~/composables/useAuth";

const auth = useAuth();
const router = useRouter();

const handleLogout = () => {
    auth.logout();
    router.push("/");
};
</script>

<style scoped>
@import "~/assets/css/nav.css";
</style>
