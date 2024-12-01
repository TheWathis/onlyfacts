import { ref, reactive } from "vue";

interface User {
  id: number;
  username: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const state = reactive<AuthState>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
});

export function useAuth() {
  const register = async (username: string, password: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const { user, token } = await response.json();

      if (import.meta.client) {
        localStorage.setItem("auth_token", token);
      }

      state.user = user;
      state.isAuthenticated = true;

      return user;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const { user, token } = await response.json();

      if (import.meta.client) {
        localStorage.setItem("auth_token", token);
      }

      state.user = user;
      state.isAuthenticated = true;

      return user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const checkAuth = async () => {
    // Only check localStorage if we're on client side
    if (!import.meta.client) {
      return false;
    }

    const token = localStorage.getItem("auth_token");

    if (!token) {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      return false;
    }

    try {
      state.isLoading = true;
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Invalid token");
      }

      const user = await response.json();
      state.user = user;
      state.isAuthenticated = true;
      return true;
    } catch (error) {
      console.error("Auth check error:", error);
      logout();
      return false;
    } finally {
      state.isLoading = false;
    }
  };

  const logout = () => {
    if (import.meta.client) {
      localStorage.removeItem("auth_token");
    }
    state.user = null;
    state.isAuthenticated = false;
  };

  return {
    state,
    register,
    login,
    logout,
    checkAuth,
  };
}
