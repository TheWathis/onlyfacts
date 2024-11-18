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
                <NuxtLink to="/facts" class="nav-link">Facts</NuxtLink>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.navbar {
    background-color: #f5f5f5;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-brand h1 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
}

.brand-link {
    text-decoration: none;
    color: inherit;
    transition: color 0.2s ease;
}

.brand-link:hover {
    color: #00dc82;
}

.nav-links {
    display: flex;
    gap: 1.5rem;
}

.nav-link {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.2s ease;
}

.nav-link:hover {
    color: #00dc82;
}

.nav-link.router-link-active {
    color: #00dc82;
}
</style>
