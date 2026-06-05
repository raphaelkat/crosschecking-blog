import { Toast } from "@/hooks/useToast";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

/**
 * Toast Container Component
 * Display toast notifications at the bottom-right of the screen
 */
export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  const getIcon = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case "info":
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBackgroundColor = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800";
      case "error":
        return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800";
      case "warning":
        return "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800";
      case "info":
      default:
        return "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800";
    }
  };

  const getTextColor = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "text-green-900 dark:text-green-100";
      case "error":
        return "text-red-900 dark:text-red-100";
      case "warning":
        return "text-amber-900 dark:text-amber-100";
      case "info":
      default:
        return "text-blue-900 dark:text-blue-100";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-lg border ${getBackgroundColor(
            toast.type
          )} ${getTextColor(toast.type)} shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300`}
          role="alert"
        >
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(toast.type)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(toast.id)}
            className="flex-shrink-0 h-6 w-6 p-0 hover:bg-black/10 dark:hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
