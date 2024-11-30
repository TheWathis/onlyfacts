<template>
    <form @submit.prevent="handleSubmit" class="auth-form">
        <h2>Create Account</h2>

        <div class="form-group">
            <label for="username">Username</label>
            <input
                type="text"
                id="username"
                v-model="username"
                required
                autocomplete="username"
                placeholder="Choose a username"
            />
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <input
                type="password"
                id="password"
                v-model="password"
                required
                autocomplete="new-password"
                placeholder="Choose a password"
            />
        </div>

        <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                required
                autocomplete="new-password"
                placeholder="Confirm your password"
            />
        </div>

        <div class="error" v-if="error">{{ error }}</div>

        <button type="submit" :disabled="isLoading">
            {{ isLoading ? "Creating account..." : "Register" }}
        </button>
    </form>
</template>

<script setup lang="ts">
const username = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");
const isLoading = ref(false);
const auth = useAuth();
const router = useRouter();

async function handleSubmit() {
    if (isLoading.value) return;

    error.value = "";
    isLoading.value = true;

    try {
        if (password.value !== confirmPassword.value) {
            throw new Error("Passwords do not match");
        }
        await auth.register(username.value, password.value);
        router.push("/");
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
