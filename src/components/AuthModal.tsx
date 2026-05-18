"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import AuthPanel from "@/components/AuthPanel";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  nextPath?: string;
};

export default function AuthModal({ isOpen, onClose, nextPath }: AuthModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 px-4 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative w-full max-w-md"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-white/10 dark:hover:text-white z-10"
              aria-label="Close login modal"
            >
              <X className="h-4 w-4" />
            </button>
            <AuthPanel nextPath={nextPath} onSuccess={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}