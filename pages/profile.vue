<template>
    <div class="profile-page">
        <div class="profile-tabs">
            <button
                :class="{ active: activeTab === 'stats' }"
                @click="activeTab = 'stats'"
            >
                Your OnlyStats
            </button>
            <button
                :class="{ active: activeTab === 'facts' }"
                @click="activeTab = 'facts'"
            >
                Your OnlyFacts
            </button>
        </div>

        <div class="profile-content">
            <!-- Stats Tab -->
            <div v-if="activeTab === 'stats'" class="stats-container">
                <div class="progress-section">
                    <div class="circular-progress">
                        <svg viewBox="0 0 100 100">
                            <circle
                                class="progress-bg"
                                cx="50"
                                cy="50"
                                r="45"
                            ></circle>
                            <circle
                                class="progress-bar"
                                cx="50"
                                cy="50"
                                r="45"
                                :style="`stroke-dashoffset: ${
                                    283 -
                                    (283 * stats.factsSeenPercentage) / 100
                                }`"
                            ></circle>
                        </svg>
                        <div class="progress-content">
                            <div class="progress-value">
                                {{ stats.factsSeenPercentage }}%
                            </div>
                            <div class="progress-label">Facts Seen</div>
                            <div class="progress-sublabel">
                                {{ stats.factsSeen }} of {{ stats.totalFacts }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="stats-details">
                    <div class="stat-item">
                        <div class="stat-value">{{ stats.factsCreated }}</div>
                        <div class="stat-label">Facts Created</div>
                    </div>

                    <div class="stat-item votes">
                        <div class="votes-container">
                            <div class="vote-stat upvotes">
                                <Icon name="mdi:thumb-up" />
                                {{ stats.voting.upvotes }}
                            </div>
                            <div class="vote-stat downvotes">
                                <Icon name="mdi:thumb-down" />
                                {{ stats.voting.downvotes }}
                            </div>
                        </div>
                        <div class="stat-label">Votes Given</div>
                    </div>
                </div>
            </div>

            <!-- Facts Tab -->
            <div v-else-if="activeTab === 'facts'" class="facts-container">
                <div v-if="!isAddingFact" class="add-fact-button-container">
                    <button
                        class="add-fact-button"
                        @click="isAddingFact = true"
                    >
                        <Icon name="mdi:plus" />
                        Share a new fact
                    </button>
                </div>
                <AddFactForm
                    v-else
                    @fact-added="onFactAdded"
                    @cancel="isAddingFact = false"
                />

                <div v-if="userFacts.length === 0" class="no-facts">
                    You haven't shared any facts yet.
                </div>
                <FactsList v-else :facts="userFacts" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuth } from "~/composables/useAuth";

const auth = useAuth();
const activeTab = ref("stats");
const isAddingFact = ref(false);

const stats = ref({
    factsCreated: 0,
    factsSeen: 0,
    factsSeenPercentage: 0,
    totalFacts: 0,
    voting: {
        upvotes: 0,
        downvotes: 0,
    },
});
const userFacts = ref([]);

const onFactAdded = (newFact) => {
    userFacts.value = [newFact, ...userFacts.value];
    isAddingFact.value = false;
    // Update stats
    stats.value.factsCreated++;
};

onMounted(async () => {
    try {
        // Fetch stats
        const statsResponse = await fetch("/api/profile/stats", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
        });
        if (statsResponse.ok) {
            stats.value = await statsResponse.json();
        }

        // Fetch user's facts
        const factsResponse = await fetch("/api/profile/facts", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
        });
        if (factsResponse.ok) {
            userFacts.value = await factsResponse.json();
        }
    } catch (error) {
        console.error("Error fetching profile data:", error);
    }
});
</script>

<style scoped>
.profile-page {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.profile-tabs {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
    border-bottom: 2px solid #eee;
    padding-bottom: 1rem;
}

.profile-tabs button {
    padding: 0.8rem 1.5rem;
    border: none;
    background: none;
    font-size: 1.1rem;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 8px;
}

.profile-tabs button.active {
    color: #00dc82;
    background-color: rgba(0, 220, 130, 0.1);
}

.profile-tabs button:hover {
    color: #00dc82;
    background-color: rgba(0, 220, 130, 0.1);
}

.profile-content {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 3rem;
}

.stats-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
}

.progress-section {
    display: flex;
    justify-content: center;
}

.circular-progress {
    position: relative;
    width: 300px;
    height: 300px;
}

.circular-progress svg {
    transform: rotate(-90deg);
}

.progress-bg {
    fill: none;
    stroke: #f0f0f0;
    stroke-width: 8;
}

.progress-bar {
    fill: none;
    stroke: #00dc82;
    stroke-width: 8;
    stroke-linecap: round;
    stroke-dasharray: 283;
    transition: stroke-dashoffset 1s ease;
}

.progress-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

.progress-value {
    font-size: 3rem;
    font-weight: bold;
    color: #00dc82;
}

.progress-label {
    font-size: 1.2rem;
    color: #666;
    margin-top: 0.5rem;
}

.progress-sublabel {
    font-size: 0.9rem;
    color: #999;
    margin-top: 0.25rem;
}

.stats-details {
    display: flex;
    flex-direction: column;
    gap: 3rem;
}

.stat-item {
    padding: 1rem 0;
    border-bottom: 2px solid #f0f0f0;
}

.stat-value {
    font-size: 2.5rem;
    font-weight: bold;
    color: #00dc82;
}

.stat-label {
    font-size: 1.1rem;
    color: #666;
    margin-top: 0.5rem;
}

.facts-container {
    max-width: 800px;
}

.add-fact-button-container {
    margin-bottom: 2rem;
    text-align: center;
}

.add-fact-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    border: none;
    border-radius: 8px;
    background-color: #00dc82;
    color: white;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 0 auto;
}

.add-fact-button:hover {
    background-color: #00b76b;
}

.no-facts {
    text-align: center;
    padding: 2rem;
    color: #666;
    background: #f5f5f5;
    border-radius: 8px;
}

.votes-container {
    display: flex;
    gap: 2rem;
}

.vote-stat {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
}

.vote-stat.upvotes {
    color: #2ecc71;
}

.vote-stat.downvotes {
    color: #e74c3c;
}

@media (max-width: 768px) {
    .stats-container {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .circular-progress {
        width: 250px;
        height: 250px;
    }

    .progress-value {
        font-size: 2.5rem;
    }

    .profile-content {
        gap: 2rem;
    }

    .profile-tabs {
        flex-direction: column;
        gap: 0.5rem;
    }

    .profile-tabs button {
        width: 100%;
    }
}
</style>
