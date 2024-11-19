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
    background-color: #ffffff05;
    padding: 1rem;
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.nav-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
}

.nav-brand h1 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 700;
    background: linear-gradient(45deg, #00dc82, #36b9cc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.5px;
}

.brand-link {
    text-decoration: none;
    color: inherit;
    transition: transform 0.3s ease;
}

.brand-link:hover {
    transform: scale(1.05);
}

.nav-links {
    display: flex;
    gap: 2rem;
    align-items: center;
}

.nav-link {
    text-decoration: none;
    color: #4a5568;
    font-weight: 600;
    font-size: 1.1rem;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    position: relative;
}

.nav-link:hover {
    color: #00dc82;
    background-color: rgba(0, 220, 130, 0.1);
}

.nav-link::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: linear-gradient(45deg, #00dc82, #36b9cc);
    transition: width 0.3s ease;
}

.nav-link:hover::after {
    width: 80%;
}

.nav-link.router-link-active {
    color: #00dc82;
    background-color: rgba(0, 220, 130, 0.1);
}

.nav-link.router-link-active::after {
    width: 80%;
}

@media (max-width: 768px) {
    .nav-content {
        padding: 0 1rem;
    }

    .nav-brand h1 {
        font-size: 1.5rem;
    }

    .nav-links {
        gap: 1rem;
    }

    .nav-link {
        font-size: 1rem;
        padding: 0.4rem 0.8rem;
    }
}
</style>
