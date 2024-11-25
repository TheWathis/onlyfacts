<template>
    <form @submit.prevent="handleSubmit" class="auth-form">
        <h2>Welcome Back!</h2>

        <div class="form-group">
            <label for="username">Username</label>
            <input
                type="text"
                id="username"
                v-model="username"
                required
                autocomplete="username"
                placeholder="Enter your username"
            />
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <input
                type="password"
                id="password"
                v-model="password"
                required
                autocomplete="current-password"
                placeholder="Enter your password"
            />
        </div>

        <div class="error" v-if="error">{{ error }}</div>

        <button type="submit" :disabled="isLoading">
            {{ isLoading ? "Logging in..." : "Login" }}
        </button>
    </form>
</template>

<script setup lang="ts">
const username = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);
const auth = useAuth();
const router = useRouter();

async function handleSubmit() {
    if (isLoading.value) return;

    error.value = "";
    isLoading.value = true;

    try {
        await auth.login(username.value, password.value);
        await router.push("/facts");
    } catch (e) {
        error.value = e.message;
    } finally {
        isLoading.value = false;
    }
}
</script>

<style scoped>
@import "~/assets/css/auth.css";
</style>
