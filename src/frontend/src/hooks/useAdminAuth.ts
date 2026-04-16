/**
 * useAdminAuth — admin authentication hook.
 *
 * - Storage key: 'previewAuth' (session), 'adminBruteForce' (lockout state)
 * - Accepts both credential sets:
 *     Faheem01 / adminfaheem123  (legacy)
 *     admin@anime.com / admin123  (new)
 * - isAdminLoggedIn returns false if NOT in preview mode (/preview/*)
 * - Brute-force protection: 5 attempts max, 15-minute lockout
 */
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isPreviewMode } from "../lib/modeContext";

const VALID_CREDENTIALS = [
  { username: "Faheem01", password: "adminfaheem123" },
  { username: "admin@anime.com", password: "admin123" },
];

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const BRUTE_FORCE_KEY = "adminBruteForce";

interface BruteForceState {
  failedAttempts: number;
  lockedUntil: number | null; // timestamp in ms, null = not locked
}

function getBruteForceState(): BruteForceState {
  try {
    const raw = localStorage.getItem(BRUTE_FORCE_KEY);
    if (!raw) return { failedAttempts: 0, lockedUntil: null };
    return JSON.parse(raw) as BruteForceState;
  } catch {
    return { failedAttempts: 0, lockedUntil: null };
  }
}

function saveBruteForceState(state: BruteForceState): void {
  localStorage.setItem(BRUTE_FORCE_KEY, JSON.stringify(state));
}

function isCurrentlyLocked(state: BruteForceState): boolean {
  if (!state.lockedUntil) return false;
  if (Date.now() < state.lockedUntil) return true;
  // Lockout expired — clear it
  const cleared: BruteForceState = { failedAttempts: 0, lockedUntil: null };
  saveBruteForceState(cleared);
  return false;
}

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
      name: "previewAuth",
      partialize: (state) => ({
        isAdminLoggedIn: state.isAdminLoggedIn,
        adminPrincipal: state.adminPrincipal,
      }),
    },
  ),
);

export function useAdminAuth() {
  const {
    isAdminLoggedIn: storedLoggedIn,
    adminPrincipal,
    setAdmin,
    clearAdmin,
  } = useAdminAuthStore();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [bruteForce, setBruteForce] =
    useState<BruteForceState>(getBruteForceState);
  const [lockoutSecondsLeft, setLockoutSecondsLeft] = useState<number>(0);

  // Admin controls only active when in preview mode
  const isAdminLoggedIn = storedLoggedIn && isPreviewMode();

  // Sync brute force state from localStorage on mount
  useEffect(() => {
    const state = getBruteForceState();
    setBruteForce(state);
  }, []);

  // Countdown timer for lockout
  useEffect(() => {
    if (!bruteForce.lockedUntil) {
      setLockoutSecondsLeft(0);
      return;
    }
    const updateCountdown = () => {
      const remaining = Math.max(
        0,
        Math.ceil((bruteForce.lockedUntil! - Date.now()) / 1000),
      );
      setLockoutSecondsLeft(remaining);
      if (remaining === 0) {
        // Lockout expired
        const cleared: BruteForceState = {
          failedAttempts: 0,
          lockedUntil: null,
        };
        saveBruteForceState(cleared);
        setBruteForce(cleared);
      }
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [bruteForce.lockedUntil]);

  const isLocked =
    bruteForce.lockedUntil !== null && Date.now() < bruteForce.lockedUntil;

  const loginWithCredentials = async (username: string, password: string) => {
    setError(null);

    // Check lockout
    const currentState = getBruteForceState();
    if (isCurrentlyLocked(currentState)) {
      const remaining = Math.ceil(
        (currentState.lockedUntil! - Date.now()) / 1000,
      );
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      setError(`Too many failed attempts. Try again in ${mins}m ${secs}s.`);
      setBruteForce(currentState);
      return;
    }

    setIsLoggingIn(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const valid = VALID_CREDENTIALS.some(
        (c) => c.username === username && c.password === password,
      );
      if (valid) {
        // Success — reset brute force
        const cleared: BruteForceState = {
          failedAttempts: 0,
          lockedUntil: null,
        };
        saveBruteForceState(cleared);
        setBruteForce(cleared);
        setAdmin(username);
      } else {
        // Failed attempt
        const newAttempts = currentState.failedAttempts + 1;
        const newState: BruteForceState =
          newAttempts >= MAX_ATTEMPTS
            ? {
                failedAttempts: newAttempts,
                lockedUntil: Date.now() + LOCKOUT_DURATION_MS,
              }
            : { failedAttempts: newAttempts, lockedUntil: null };

        saveBruteForceState(newState);
        setBruteForce(newState);

        if (newState.lockedUntil) {
          setError("Too many failed attempts. Account locked for 15 minutes.");
        } else {
          const remaining = MAX_ATTEMPTS - newAttempts;
          setError(
            `Invalid credentials. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`,
          );
        }
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = () => {
    clearAdmin();
    localStorage.removeItem("previewAuth");
    queryClient.clear();
  };

  return {
    isAdminLoggedIn,
    adminPrincipal,
    loginWithCredentials,
    logout,
    isLoggingIn,
    error,
    // Brute-force state for UI
    failedAttempts: bruteForce.failedAttempts,
    maxAttempts: MAX_ATTEMPTS,
    isLocked,
    lockoutSecondsLeft,
  };
}
