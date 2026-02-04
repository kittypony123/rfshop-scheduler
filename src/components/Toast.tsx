export interface ToastItem {
  id: number
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
}

interface ToastProps {
  toasts: ToastItem[]
  removeToast: (id: number) => void
}

const typeStyles: Record<ToastItem['type'], string> = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  warning: 'bg-yellow-500 text-white',
  info: 'bg-blue-600 text-white',
}

export function Toast({ toasts, removeToast }: ToastProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2" role="alert" aria-live="polite">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast-enter px-4 py-3 rounded-lg shadow-lg max-w-sm ${typeStyles[toast.type]}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 opacity-80 hover:opacity-100 cursor-pointer"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
