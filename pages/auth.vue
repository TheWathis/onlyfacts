<template>
    <div class="auth-page">
        <div class="auth-container">
            <div class="auth-tabs">
                <button
                    :class="{ active: activeTab === 'login' }"
                    @click="activeTab = 'login'"
                >
                    Login
                </button>
                <button
                    :class="{ active: activeTab === 'register' }"
                    @click="activeTab = 'register'"
                >
                    Register
                </button>
            </div>

            <LoginForm
                v-if="activeTab === 'login'"
                @success="handleAuthSuccess"
            />
            <RegisterForm v-else @success="handleAuthSuccess" />
        </div>
    </div>
</template>

<script setup>
import LoginForm from "~/components/auth/LoginForm.vue";
import RegisterForm from "~/components/auth/RegisterForm.vue";
import { ref } from "vue";
const router = useRouter();

const activeTab = ref("login");

const handleAuthSuccess = () => {
    router.push("/");
};
</script>

<style scoped>
@import "~/assets/css/auth.css";
</style>
