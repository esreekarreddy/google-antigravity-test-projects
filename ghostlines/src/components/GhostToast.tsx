import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Info, AlertTriangle, CheckCircle, X } from 'lucide-react';
import clsx from 'clsx';
import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info' | 'secure';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastStore {
    toasts: Toast[];
    addToast: (type: ToastType, message: string) => void;
    removeToast: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
    toasts: [],
    addToast: (type, message) => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({ toasts: [...state.toasts, { id, type, message }] }));
        setTimeout(() => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })), 3000);
    },
    removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function GhostToaster() {
    const { toasts, removeToast } = useToast();

    return (
        // Mobile: bottom-center, Desktop: bottom-right
        <div className="fixed bottom-20 sm:bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="pointer-events-auto"
                    >
                        <div className={clsx(
                            // Mobile-friendly: full width on mobile, fixed width on desktop
                            "flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border backdrop-blur-md shadow-2xl",
                            "w-full sm:min-w-[280px] sm:max-w-[350px]",
                            toast.type === 'secure' && "bg-emerald-950/90 border-emerald-500/30 text-emerald-100",
                            toast.type === 'error' && "bg-red-950/90 border-red-500/30 text-red-100",
                            toast.type === 'success' && "bg-blue-950/90 border-blue-500/30 text-blue-100",
                            toast.type === 'info' && "bg-zinc-900/90 border-zinc-700 text-zinc-100",
                        )}>
                            <div className={clsx(
                                "p-1.5 sm:p-2 rounded-full shrink-0",
                                toast.type === 'secure' && "bg-emerald-500/20 text-emerald-400",
                                toast.type === 'error' && "bg-red-500/20 text-red-400",
                                toast.type === 'success' && "bg-blue-500/20 text-blue-400",
                                toast.type === 'info' && "bg-zinc-700/50 text-zinc-400",
                            )}>
                                {toast.type === 'secure' && <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                {toast.type === 'error' && <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                {toast.type === 'success' && <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                {toast.type === 'info' && <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                            </div>
                            
                            <span className="text-xs sm:text-sm font-medium flex-1 truncate">{toast.message}</span>
                            
                            <button 
                              onClick={() => removeToast(toast.id)} 
                              className="opacity-50 hover:opacity-100 active:scale-90 transition-all shrink-0 p-1"
                              aria-label="Dismiss"
                            >
                                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
