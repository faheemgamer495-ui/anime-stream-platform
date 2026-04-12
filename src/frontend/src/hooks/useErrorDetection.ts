import { useCallback, useEffect, useRef, useState } from "react";

interface VideoErrorEvent extends CustomEvent {
  detail: {
    type: string;
    message: string;
  };
}

interface ErrorDetectionResult {
  lastError: string | null;
  clearError: () => void;
  reportVideoError: (type: string, message: string) => void;
}

const ERROR_EXPIRY_MS = 60_000;

export function useErrorDetection(): ErrorDetectionResult {
  const [lastError, setLastError] = useState<string | null>(null);
  const expiryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearError = useCallback(() => {
    setLastError(null);
    if (expiryTimer.current) {
      clearTimeout(expiryTimer.current);
      expiryTimer.current = null;
    }
  }, []);

  const setErrorWithExpiry = useCallback((msg: string) => {
    if (expiryTimer.current) clearTimeout(expiryTimer.current);
    setLastError(msg);
    expiryTimer.current = setTimeout(() => {
      setLastError(null);
      expiryTimer.current = null;
    }, ERROR_EXPIRY_MS);
  }, []);

  const reportVideoError = useCallback(
    (type: string, message: string) => {
      const errorMsg = `Video error (${type}): ${message}`;
      console.error("[useErrorDetection]", errorMsg);
      setErrorWithExpiry(errorMsg);
    },
    [setErrorWithExpiry],
  );

  useEffect(() => {
    const handleVideoError = (e: Event) => {
      const event = e as VideoErrorEvent;
      const { type = "unknown", message = "Video failed to load" } =
        event.detail ?? {};
      const errorMsg = `Video error (${type}): ${message}`;
      console.error("[useErrorDetection] videoError event:", errorMsg);
      setErrorWithExpiry(errorMsg);
    };

    window.addEventListener("videoError", handleVideoError);
    return () => {
      window.removeEventListener("videoError", handleVideoError);
      if (expiryTimer.current) clearTimeout(expiryTimer.current);
    };
  }, [setErrorWithExpiry]);

  return { lastError, clearError, reportVideoError };
}
