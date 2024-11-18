<template>
    <div class="app-container">
        <header>
            <NavBar />
        </header>

        <main>
            <NuxtPage />
        </main>

        <footer>
            <p>© 2024 WathisCorp</p>
        </footer>
    </div>
</template>

<style>
/* Reset default margin and padding */
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
    flex: 1; /* This makes the main content area grow to fill available space */
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

footer {
    text-align: center;
    padding: 1rem;
    background: #f5f5f5;
}
</style>
