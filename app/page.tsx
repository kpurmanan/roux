"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Shield, Zap, Trophy } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
            {/* Header */}
            <header className="glass-subtle border-b border-border/50 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Trophy className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold gradient-text">PacePass</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link
                            href="/auth/sign-in"
                            className="glass px-6 py-2 rounded-full font-medium hover:scale-105 transition-transform"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 md:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Run Anywhere.
                        <br />
                        <span className="gradient-text">Trust & Timing.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                        The world&apos;s premier platform for endurance events. From marathons to triathlons,
                        manage every aspect of your race with precision and style.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/events"
                            className="glass-elevated px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform inline-flex items-center gap-2"
                        >
                            Browse Events <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            href="/auth/sign-up"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform text-white"
                        >
                            Get Started
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Features */}
            <section className="container mx-auto px-4 py-20">
                <div className="grid md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <GlassCard variant="elevated" className="h-full">
                            <div className="glass-subtle rounded-full p-4 w-fit mb-4">
                                <Globe className="h-8 w-8 text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Run Anywhere</h3>
                            <p className="text-muted-foreground">
                                From London to Tokyo, Dubai to New York. Access world-class events across every continent.
                            </p>
                        </GlassCard>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <GlassCard variant="elevated" className="h-full">
                            <div className="glass-subtle rounded-full p-4 w-fit mb-4">
                                <Shield className="h-8 w-8 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Trust & Security</h3>
                            <p className="text-muted-foreground">
                                Enterprise-grade security with role-based access control. Your data is safe with us.
                            </p>
                        </GlassCard>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <GlassCard variant="elevated" className="h-full">
                            <div className="glass-subtle rounded-full p-4 w-fit mb-4">
                                <Zap className="h-8 w-8 text-yellow-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Real-Time Timing</h3>
                            <p className="text-muted-foreground">
                                Precision timing with split tracking, live results, and instant performance analytics.
                            </p>
                        </GlassCard>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="container mx-auto px-4 py-20">
                <GlassCard variant="elevated" className="p-12">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-5xl font-bold gradient-text mb-2">500K+</div>
                            <div className="text-muted-foreground">Athletes Worldwide</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold gradient-text mb-2">1,200+</div>
                            <div className="text-muted-foreground">Events Annually</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold gradient-text mb-2">98%</div>
                            <div className="text-muted-foreground">Satisfaction Rate</div>
                        </div>
                    </div>
                </GlassCard>
            </section>

            {/* CTA */}
            <section className="container mx-auto px-4 py-20">
                <GlassCard variant="elevated" className="p-12 text-center">
                    <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join thousands of athletes, organisers, and coaches using PacePass to achieve their goals.
                    </p>
                    <Link
                        href="/auth/sign-up"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform text-white inline-flex items-center gap-2"
                    >
                        Create Free Account <ArrowRight className="h-5 w-5" />
                    </Link>
                </GlassCard>
            </section>

            {/* Footer */}
            <footer className="glass-subtle border-t border-border/50 mt-20">
                <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
                    <p>&copy; 2026 PacePass. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
