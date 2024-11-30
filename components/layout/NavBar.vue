<template>
    <nav class="navbar">
        <div class="nav-content">
            <div class="nav-brand">
                <NuxtLink to="/" class="brand-link">
                    <h1>OnlyFacts</h1>
                </NuxtLink>
            </div>

            <div class="nav-links">
                <NuxtLink
                    v-for="link in navigationLinks"
                    :key="link.path"
                    :to="link.path"
                    class="nav-link"
                >
                    <Icon v-if="link.icon" :name="link.icon" class="nav-icon" />
                    {{ link.label }}
                </NuxtLink>

                <span
                    v-if="auth.state.isAuthenticated"
                    class="nav-link logout-link"
                    @click="handleLogout"
                >
                    <Icon name="mdi:logout" class="nav-icon" />
                    Logout
                </span>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { useAuth } from "~/composables/useAuth";
import { computed } from "vue";

const auth = useAuth();
const router = useRouter();

const navigationLinks = computed(() => {
    const links = [{ path: "/", label: "Home", icon: "mdi:home" }];

    if (auth.state.isAuthenticated) {
        links.push({
            path: "/profile",
            label: auth.state.user?.username,
            icon: "mdi:account",
            isUserLink: true,
        });
    } else {
        links.push({
            path: "/auth",
            label: "Login",
            icon: "mdi:login",
        });
    }

    return links;
});

const handleLogout = () => {
    auth.logout();
    router.push("/");
};
</script>

<style scoped>
.navbar {
    background-color: #ffffff;
    padding: 0.75rem 1rem;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.nav-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
}

.nav-brand h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(45deg, #00dc82, #36b9cc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.brand-link {
    text-decoration: none;
    color: inherit;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: #666;
    font-size: 0.95rem;
    padding: 0.5rem;
    transition: all 0.2s ease;
    position: relative;
}

.nav-icon {
    font-size: 1.2rem;
}

.nav-link:hover {
    color: #00dc82;
}

.nav-link.router-link-active {
    color: #00dc82;
}

.nav-link.router-link-active::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: #00dc82;
    border-radius: 2px;
}

.logout-link {
    cursor: pointer;
    color: #666;
}

.logout-link:hover {
    color: #dc3545;
}

@media (max-width: 768px) {
    .nav-content {
        padding: 0 0.5rem;
    }

    .nav-brand h1 {
        font-size: 1.3rem;
    }

    .nav-links {
        gap: 1rem;
    }

    .nav-link {
        font-size: 0.9rem;
    }
}
</style>
