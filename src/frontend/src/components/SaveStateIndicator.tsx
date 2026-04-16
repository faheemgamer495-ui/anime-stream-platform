/**
 * SaveStateIndicator — compact animated pill showing save operation status.
 * Usage:
 *   <SaveStateIndicator state="saving" />
 *   <SaveStateIndicator state="saved" />
 *   <SaveStateIndicator state="error" message="Failed to save" />
 *   <SaveStateIndicator state="idle" />  // renders nothing
 */
import { Check, RefreshCw, X } from "lucide-react";

export type SaveState = "idle" | "saving" | "saved" | "error";

interface SaveStateIndicatorProps {
  state: SaveState;
  message?: string;
  className?: string;
}

export default function SaveStateIndicator({
  state,
  message,
  className = "",
}: SaveStateIndicatorProps) {
  if (state === "idle") return null;

  const config = {
    saving: {
      base: "save-state-indicator save-state-saving",
      icon: <RefreshCw className="save-state-icon animate-spin" />,
      label: message ?? "Saving…",
    },
    saved: {
      base: "save-state-indicator save-state-saved",
      icon: <Check className="save-state-icon" />,
      label: message ?? "Saved",
    },
    error: {
      base: "save-state-indicator save-state-error",
      icon: <X className="save-state-icon" />,
      label: message ?? "Save failed",
    },
  };

  const { base, icon, label } = config[state];

  return (
    <output
      className={`${base} ${className}`}
      aria-live="polite"
      data-ocid={`save-state-${state}`}
    >
      {icon}
      <span>{label}</span>
    </output>
  );
}
