"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Trophy } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { useAuth } from "@/lib/auth/context";

export default function SignInPage() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const success = await signIn(email, password);

        if (success) {
            router.push("/app");
        } else {
            setError("Invalid credentials. Try: marcus.chen@email.com");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md"
            >
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Trophy className="h-7 w-7 text-white" />
                    </div>
                    <span className="text-3xl font-bold gradient-text">PacePass</span>
                </Link>

                <GlassCard variant="elevated">
                    <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground mb-6">Sign in to your account</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="glass w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="glass w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="glass-subtle border border-red-500/30 rounded-xl p-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-xl font-semibold hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center gap-2"
                        >
                            {loading ? "Signing in..." : "Sign In"} <ArrowRight className="h-5 w-5" />
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/sign-up" className="text-purple-400 hover:underline font-medium">
                            Sign up
                        </Link>
                    </div>

                    <div className="mt-4 p-3 glass-subtle rounded-xl text-xs text-muted-foreground">
                        <p className="font-semibold mb-1">Demo Accounts:</p>
                        <p>Athlete: marcus.chen@email.com</p>
                        <p>Organiser: sarah@marathonpro.com</p>
                        <p>Coach: coach.david@runclub.com</p>
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    );
}
