/**
 * useAuth — user authentication hook.
 *
 * - Storage key: 'liveAuth'
 * - Users must explicitly log in or sign up — no auto-anonymous session
 * - isLoggedIn: true only if liveAuth exists with valid data
 * - login(username, password): validates username+password, stores session
 * - signup(username, password): creates new user session
 * - logout(): clears 'liveAuth' only
 */
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { UserSession } from "../types";

const LIVE_AUTH_KEY = "liveAuth";
const USERS_KEY = "live_users_registry";

interface StoredUser {
  userId: string;
  username: string;
  passwordHash: string; // simple base64 — not cryptographic, but hides plaintext
}

function hashPassword(password: string): string {
  return btoa(`${password}_anime_salt`);
}

function getUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(LIVE_AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

function saveSession(session: UserSession): void {
  localStorage.setItem(LIVE_AUTH_KEY, JSON.stringify(session));
}

export function useAuth() {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<UserSession | null>(getSession);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep session in sync if another tab logs out
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === LIVE_AUTH_KEY) {
        setSession(getSession());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const isLoggedIn = session !== null;
  const user = session;
  const principalId = session?.userId ?? null;

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    setError(null);
    setIsLoggingIn(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const users = getUsers();
      const found = users.find(
        (u) =>
          u.username.toLowerCase() === username.toLowerCase() &&
          u.passwordHash === hashPassword(password),
      );
      if (!found) {
        setError("Invalid username or password.");
        return false;
      }
      const newSession: UserSession = {
        userId: found.userId,
        username: found.username,
        role: "user",
      };
      saveSession(newSession);
      setSession(newSession);
      return true;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const signup = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    setError(null);
    setIsLoggingIn(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (username.trim().length < 3) {
        setError("Username must be at least 3 characters.");
        return false;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return false;
      }
      const users = getUsers();
      const exists = users.some(
        (u) => u.username.toLowerCase() === username.toLowerCase(),
      );
      if (exists) {
        setError("Username already taken. Please choose another.");
        return false;
      }
      const newUser: StoredUser = {
        userId: `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        username: username.trim(),
        passwordHash: hashPassword(password),
      };
      saveUsers([...users, newUser]);
      const newSession: UserSession = {
        userId: newUser.userId,
        username: newUser.username,
        role: "user",
      };
      saveSession(newSession);
      setSession(newSession);
      return true;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(LIVE_AUTH_KEY);
    setSession(null);
    setError(null);
    queryClient.clear();
  };

  const clearError = () => setError(null);

  return {
    identity: null,
    isLoggedIn,
    user,
    login,
    logout,
    signup,
    isLoggingIn,
    error,
    clearError,
    // Legacy compat fields
    principalId,
    loginStatus: isLoggedIn ? "success" : "idle",
    isInitializing: false,
  };
}
