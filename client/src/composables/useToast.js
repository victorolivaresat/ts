import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

let toast = null;

export function initToast() {
  if (!toast) {
    toast = useToast();
  }
}

export function showToast(message, type = "success", options = {}) {
  if (!toast) {
    initToast();
  }
  
  toast.open({
    message,
    type,
    position: options.position || "top-right",
    duration: options.duration ?? 3000,
    dismissible: options.dismissible ?? true,
    queue: options.queue ?? false,
    pauseOnHover: options.pauseOnHover ?? true,
    onClick: options.onClick || null,
    onDismiss: options.onDismiss || null,
  });
}
