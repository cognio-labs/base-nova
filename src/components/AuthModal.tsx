"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Code2, Loader2, Mail, Phone, ShieldCheck, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

type AuthMode = "email" | "phone";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/workspace";
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const { isConfigured, refreshUser } = useAuth();

  const [mode, setMode] = useState<AuthMode>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const siteUrl =
    typeof window === "undefined" ? process.env.NEXT_PUBLIC_SITE_URL : window.location.origin;

  const finishLogin = async () => {
    await refreshUser();
    onClose();
    router.push(nextPath);
    router.refresh();
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setIsLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (!signInError) {
      setMessage("Welcome back. Opening your workspace...");
      await finishLogin();
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setMessage("Account created. Check your email if confirmation is enabled.");
    }

    setIsLoading(false);
  };

  const handleSendOtp = async () => {
    if (!phone) {
      setError("Phone number is required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error: otpError } = await supabase.auth.signInWithOtp({ phone });
    if (otpError) {
      setError(otpError.message);
    } else {
      setOtpSent(true);
      setMessage("OTP sent. Enter the code to continue.");
    }

    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!phone || !otp) {
      setError("Phone number and OTP are required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: "sms",
    });

    if (verifyError) {
      setError(verifyError.message);
      setIsLoading(false);
    } else {
      await finishLogin();
    }
  };

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
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="relative w-full max-w-md"
          >
            <div className="absolute -inset-1 rounded-[1.35rem] bg-gradient-to-r from-sky-300/40 via-white/20 to-cyan-400/40 blur-xl" />
            <Card className="relative overflow-hidden border-sky-200/60 dark:border-sky-300/20">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Close login modal"
              >
                <X className="h-4 w-4" />
              </button>

              <CardHeader className="pr-14">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/15 text-sky-500">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <CardTitle>Login to LokoAI</CardTitle>
                <CardDescription>
                  Sign in to generate, save, and manage your AI-built apps.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {!isConfigured && (
                  <div className="rounded-xl border border-amber-300/40 bg-amber-400/10 p-3 text-xs text-amber-700 dark:text-amber-200">
                    Supabase keys are not configured yet. Add them to `.env.local` to enable login.
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => handleOAuth("google")} disabled={isLoading || !isConfigured}>
                    <Mail className="h-4 w-4" />
                    Google
                  </Button>
                  <Button variant="outline" onClick={() => handleOAuth("github")} disabled={isLoading || !isConfigured}>
                    <Code2 className="h-4 w-4" />
                    GitHub
                  </Button>
                </div>

                <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-white/5">
                  <button
                    type="button"
                    onClick={() => setMode("email")}
                    className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                      mode === "email" ? "bg-white text-slate-950 shadow dark:bg-white/10 dark:text-white" : "text-slate-500"
                    }`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("phone")}
                    className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                      mode === "phone" ? "bg-white text-slate-950 shadow dark:bg-white/10 dark:text-white" : "text-slate-500"
                    }`}
                  >
                    Phone OTP
                  </button>
                </div>

                {mode === "email" ? (
                  <div className="space-y-3">
                    <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" type="email" />
                    <Input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" />
                    <Button className="w-full" onClick={handleEmailAuth} disabled={isLoading || !isConfigured}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                      Continue with Email
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+1 555 000 0000" type="tel" />
                    {otpSent && <Input value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="6-digit OTP" inputMode="numeric" />}
                    <Button className="w-full" onClick={otpSent ? handleVerifyOtp : handleSendOtp} disabled={isLoading || !isConfigured}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Phone className="h-4 w-4" />}
                      {otpSent ? "Verify OTP" : "Send OTP"}
                    </Button>
                  </div>
                )}

                {message && <div className="rounded-xl bg-green-500/10 p-3 text-xs text-green-600 dark:text-green-300">{message}</div>}
                {error && <div className="rounded-xl bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-300">{error}</div>}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
