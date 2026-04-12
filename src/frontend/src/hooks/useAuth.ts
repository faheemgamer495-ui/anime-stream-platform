import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const {
    identity,
    login,
    clear,
    loginStatus,
    isInitializing,
    isLoggingIn,
    isLoginSuccess,
  } = useInternetIdentity();

  const queryClient = useQueryClient();

  const isLoggedIn = isLoginSuccess || !!identity;

  const logout = () => {
    clear();
    queryClient.clear();
  };

  const principalId = identity?.getPrincipal().toText() ?? null;

  return {
    identity,
    login,
    logout,
    loginStatus,
    isInitializing,
    isLoggingIn,
    isLoggedIn,
    principalId,
  };
}
