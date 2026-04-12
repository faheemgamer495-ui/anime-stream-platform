import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const ADMIN_USERNAME = "Faheem01";
const ADMIN_PASSWORD = "adminfaheem123";

interface AdminAuthState {
  isAdminLoggedIn: boolean;
  adminPrincipal: string | null;
  setAdmin: (principal: string) => void;
  clearAdmin: () => void;
}

const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAdminLoggedIn: false,
      adminPrincipal: null,
      setAdmin: (principal: string) => {
        set({ isAdminLoggedIn: true, adminPrincipal: principal });
      },
      clearAdmin: () => {
        set({ isAdminLoggedIn: false, adminPrincipal: null });
      },
    }),
    {
      name: "admin-auth",
      partialize: (state) => ({
        isAdminLoggedIn: state.isAdminLoggedIn,
        adminPrincipal: state.adminPrincipal,
      }),
    },
  ),
);

export function useAdminAuth() {
  const { isAdminLoggedIn, adminPrincipal, setAdmin, clearAdmin } =
    useAdminAuthStore();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const loginWithCredentials = async (username: string, password: string) => {
    setError(null);
    setIsLoggingIn(true);
    try {
      // Simulate a small async delay for UX
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        setAdmin(username);
      } else {
        setError("Invalid username or password. Please try again.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = () => {
    clearAdmin();
    queryClient.clear();
  };

  return {
    isAdminLoggedIn,
    adminPrincipal,
    loginWithCredentials,
    logout,
    isLoggingIn,
    error,
  };
}
