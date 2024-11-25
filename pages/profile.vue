<template>
    <div class="profile-page">
        <div class="profile-header">
            <h1>Profile</h1>
            <div class="username">{{ auth.state.user?.username }}</div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-title">Facts Created</div>
                <div class="stat-value">{{ stats.factsCreated }}</div>
            </div>

            <div class="stat-card">
                <div class="stat-title">Facts Seen</div>
                <div class="stat-value">
                    {{ stats.factsSeen }}
                    <span class="stat-percentage"
                        >({{ stats.factsSeenPercentage }}%)</span
                    >
                </div>
                <div class="stat-subtitle">
                    of {{ stats.totalFacts }} total facts
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-title">Votes Given</div>
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
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuth } from "~/composables/useAuth";

const auth = useAuth();
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

onMounted(async () => {
    try {
        const response = await fetch("/api/profile/stats", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
        });

        if (response.ok) {
            stats.value = await response.json();
        }
    } catch (error) {
        console.error("Error fetching profile stats:", error);
    }
});
</script>

<style scoped>
.profile-page {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.profile-header {
    margin-bottom: 2rem;
    text-align: center;
}

.username {
    font-size: 1.5rem;
    color: #00dc82;
    margin-top: 0.5rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.stat-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.stat-title {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 1rem;
}

.stat-value {
    font-size: 2.5rem;
    font-weight: bold;
    color: #00dc82;
}

.stat-percentage {
    font-size: 1.2rem;
    color: #666;
}

.stat-subtitle {
    font-size: 0.9rem;
    color: #666;
    margin-top: 0.5rem;
}

.votes-container {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1rem;
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
</style>
