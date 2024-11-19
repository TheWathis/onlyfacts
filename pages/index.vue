<template>
    <div class="home-container">
        <div class="hero-section">
            <div class="fact-container" :class="{ loading: isLoading }">
                <div class="fact-content">
                    <span class="quote-mark">"</span>
                    <p class="fact-text">{{ fact?.fact }}</p>
                    <span class="quote-mark">"</span>
                </div>
                <div class="fact-actions">
                    <button class="random-button" @click="loadNewFact">
                        Random Fact
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"; // Add watch import

const { getRandomFact } = useFacts();
const fact = ref(null);
const isLoading = ref(true);

async function loadNewFact() {
    isLoading.value = true;
    fact.value = await getRandomFact();
    isLoading.value = false;
}

// Initial load
loadNewFact();
</script>

<style scoped>
.home-container {
    display: flex;
    flex-direction: column;
    gap: 4rem;
    padding: 2rem 0;
}

.hero-section {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 40vh;
    padding: 2rem;
}

.fact-container {
    max-width: 800px;
    width: 100%;
    text-align: center;
    transition: opacity 0.3s ease;
}

.fact-container.loading {
    opacity: 0.5;
}

.fact-content {
    position: relative;
    margin-bottom: 2rem;
}

.quote-mark {
    font-size: 4rem;
    color: #00dc82;
    opacity: 0.3;
    font-family: Georgia, serif;
    position: absolute;
}

.quote-mark:first-child {
    top: -2rem;
    left: -2rem;
}

.quote-mark:last-child {
    bottom: -2rem;
    right: -2rem;
}

.fact-text {
    font-size: 1.8rem;
    line-height: 1.5;
    color: #2c3e50;
    margin: 2rem 0;
    padding: 0 2rem;
}

.fact-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    margin-top: 2rem;
}

.vote-buttons {
    display: flex;
    gap: 1rem;
}

.random-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 8px;
    background-color: #f5f5f5;
    color: #00dc82;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.2s ease;
}

.random-button:hover {
    background-color: #00dc82;
    color: white;
}

.content-section {
    text-align: center;
    padding: 2rem;
}

@media (max-width: 768px) {
    .fact-text {
        font-size: 1.4rem;
        padding: 0 1.5rem;
    }

    .quote-mark {
        font-size: 3rem;
    }

    .quote-mark:first-child {
        top: -1.5rem;
        left: -1rem;
    }

    .quote-mark:last-child {
        bottom: -1.5rem;
        right: -1rem;
    }

    .fact-actions {
        flex-direction: column;
        gap: 1rem;
    }
}
</style>
