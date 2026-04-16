/**
 * Toast system — lightweight, no external deps.
 * useToast() → { toast } for imperative calls
 * <ToastContainer /> → renders active toasts (mount once in Layout)
 */
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

export type ToastVariant = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number; // ms, default 4000
}

interface ToastContextValue {
  items: ToastItem[];
  add: (item: Omit<ToastItem, "id">) => string;
  remove: (id: string) => void;
}

// ── Context ────────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const add = useCallback((item: Omit<ToastItem, "id">): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setItems((prev) => [...prev, { ...item, id }]);
    return id;
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ items, add, remove }}>
      {children}
    </ToastContext.Provider>
  );
}

function useToastContext(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useToast() {
  const { add, remove } = useToastContext();

  const toast = useCallback(
    (
      titleOrOpts: string | Omit<ToastItem, "id">,
      opts?: Partial<Omit<ToastItem, "id" | "title">>,
    ) => {
      if (typeof titleOrOpts === "string") {
        return add({
          title: titleOrOpts,
          variant: "info",
          duration: 4000,
          ...opts,
        });
      }
      return add({ duration: 4000, ...titleOrOpts });
    },
    [add],
  );

  const success = useCallback(
    (title: string, description?: string) =>
      add({ variant: "success", title, description, duration: 4000 }),
    [add],
  );

  const error = useCallback(
    (title: string, description?: string) =>
      add({ variant: "error", title, description, duration: 5000 }),
    [add],
  );

  const info = useCallback(
    (title: string, description?: string) =>
      add({ variant: "info", title, description, duration: 4000 }),
    [add],
  );

  return { toast, success, error, info, dismiss: remove };
}

// ── Single Toast ───────────────────────────────────────────────────────────────

const ICONS: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />,
  error: <AlertCircle className="w-5 h-5 text-destructive shrink-0" />,
  info: <Info className="w-5 h-5 text-primary shrink-0" />,
};

function ToastCard({
  item,
  onRemove,
}: { item: ToastItem; onRemove: () => void }) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Animate in
    const raf = requestAnimationFrame(() => setVisible(true));
    // Auto dismiss
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(onRemove, 300);
    }, item.duration ?? 4000);
    return () => {
      cancelAnimationFrame(raf);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [item.duration, onRemove]);

  const variantClass =
    item.variant === "success"
      ? "border-green-500/30 bg-green-500/5"
      : item.variant === "error"
        ? "border-destructive/30 bg-destructive/5"
        : "border-primary/30 bg-primary/5";

  return (
    <div
      className={[
        "toast pointer-events-auto",
        variantClass,
        "transition-all duration-300",
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8",
      ].join(" ")}
      role="alert"
      aria-live="polite"
      data-ocid="toast"
    >
      <div className="flex items-start gap-3">
        {ICONS[item.variant]}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{item.title}</p>
          {item.description && (
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            setTimeout(onRemove, 300);
          }}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5"
          aria-label="Dismiss"
          data-ocid="toast.close_button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Container ──────────────────────────────────────────────────────────────────

export function ToastContainer() {
  const { items, remove } = useToastContext();

  if (!items.length) return null;

  return (
    <div
      className="toast-container z-[300]"
      aria-label="Notifications"
      data-ocid="toast-container"
    >
      {items.map((item) => (
        <ToastCard key={item.id} item={item} onRemove={() => remove(item.id)} />
      ))}
    </div>
  );
}
