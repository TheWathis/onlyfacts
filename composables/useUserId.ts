import { ref } from "vue";

export function useUserId() {
  const userId = ref(null);

  function generateUserId() {
    return "user_" + Math.random().toString(36).substr(2, 9);
  }

  function getUserId() {
    if (!userId.value) {
      // Try to get from localStorage
      let storedId = localStorage.getItem("userId");
      if (!storedId) {
        // Generate new ID if none exists
        storedId = generateUserId();
        localStorage.setItem("userId", storedId);
      }
      userId.value = storedId;
    }
    return userId.value;
  }

  return {
    getUserId,
  };
}
