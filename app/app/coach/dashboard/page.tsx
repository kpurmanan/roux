"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { dataStore } from "@/lib/data/store";
import { metricsRepo } from "@/lib/data/repositories/metrics-repository";
import { GlassCard } from "@/components/ui/glass-card";
import { Users, Trophy, AlertTriangle, TrendingUp, Activity } from "lucide-react";
import { User } from "@/lib/types";
import { MetricsSnapshot } from "@/lib/types/performance";
import { StatusChip } from "@/components/ui/status-chip";

export default function CoachDashboardPage() {
    const { session } = useAuth();
    const router = useRouter();
    const [athleteMetrics, setAthleteMetrics] = useState<Record<string, MetricsSnapshot>>({});

    // Derived state for athletes
    // In real app, useQuery or similar. Here we derive from session + dataStore.
    const club = session.user?.clubId ? dataStore.getClubById(session.user.clubId) : null;
    const athletes = useMemo(() =>
        club ? club.members.map((id) => dataStore.getUserById(id)).filter((u): u is User => !!u) : [],
        [club]
    );

    useEffect(() => {
        if (athletes.length > 0) {
            // Load metrics for all athletes
            const m: Record<string, MetricsSnapshot> = {};
            athletes.forEach(a => {
                const snap = metricsRepo.getSnapshot(a.id);
                if (snap) m[a.id] = snap;
            });
            setAthleteMetrics(m);
        }
    }, [athletes]); // Simple dependency

    if (!session.user) return null;

    // Calculate Team Stats
    const totalAthletes = athletes.length;
    const metricsValues = Object.values(athleteMetrics);
    const atRiskCount = metricsValues.filter(m => m.acRatio > 1.3 || m.acRatio < 0.8).length;
    const avgTeamLoad = metricsValues.reduce((acc, m) => acc + m.acuteLoad, 0) / (metricsValues.length || 1);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Coach Dashboard</h1>
                    <p className="text-muted-foreground">
                        {club ? `Managing ${club.name}` : "Manage your athletes"}
                    </p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
                    Invite Athlete
                </button>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4">
                <GlassCard>
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="h-5 w-5 text-purple-400" />
                        <span className="text-sm text-muted-foreground">Total Athletes</span>
                    </div>
                    <p className="text-3xl font-bold">{totalAthletes}</p>
                </GlassCard>
                <GlassCard>
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">At Risk</span>
                    </div>
                    <p className="text-3xl font-bold">{atRiskCount}</p>
                </GlassCard>
                <GlassCard>
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="h-5 w-5 text-blue-400" />
                        <span className="text-sm text-muted-foreground">Avg Load (7d)</span>
                    </div>
                    <p className="text-3xl font-bold">{Math.round(avgTeamLoad)}</p>
                </GlassCard>
                <GlassCard>
                    <div className="flex items-center gap-3 mb-2">
                        <Trophy className="h-5 w-5 text-green-400" />
                        <span className="text-sm text-muted-foreground">Race Ready</span>
                    </div>
                    <p className="text-3xl font-bold">12</p>
                </GlassCard>
            </div>

            {/* At Risk Panel */}
            {atRiskCount > 0 && (
                <GlassCard className="border-l-4 border-l-yellow-500/50">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        Attention Required
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {athletes
                            .filter(a => {
                                const m = athleteMetrics[a.id];
                                return m && (m.acRatio > 1.3 || m.acRatio < 0.8);
                            })
                            .map(a => {
                                const m = athleteMetrics[a.id];
                                const risk = m.acRatio > 1.3 ? "Overreaching" : "Detraining";
                                return (
                                    <div key={a.id} className="glass-subtle p-3 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
                                                {a.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{a.name}</p>
                                                <p className="text-xs text-yellow-400 font-mono">AC Ratio: {m.acRatio.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <StatusChip variant={risk === "Overreaching" ? "warning" : "default"}>{risk}</StatusChip>
                                    </div>
                                );
                            })}
                    </div>
                </GlassCard>
            )}

            {/* Roster */}
            <GlassCard>
                <h3 className="font-bold mb-4">Athlete Roster</h3>
                <div className="space-y-3">
                    {athletes.map((athlete: User) => {
                        const consent = dataStore.getConsent(athlete.id);
                        const hasAccess = consent?.allowCoachView || consent?.allowClubView;
                        const metrics = athleteMetrics[athlete.id];

                        return (
                            <div key={athlete.id} className="glass-subtle p-4 rounded-xl flex items-center justify-between group hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                                        {athlete.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold">{athlete.name}</p>
                                            {metrics?.performanceDna?.[0] && (
                                                <span className="text-[10px] uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full text-muted-foreground">
                                                    {metrics.performanceDna[0]}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                            <span className="flex items-center gap-1">
                                                <Activity className="h-3 w-3" />
                                                Load: {metrics ? Math.round(metrics.acuteLoad) : "--"}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <TrendingUp className="h-3 w-3" />
                                                Consistency: {metrics ? Math.round(metrics.consistencyScore) : "--"}%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* Quick Visuals */}
                                    {metrics && (
                                        <div className="hidden md:flex flex-col items-end mr-4">
                                            <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                                                <div style={{ width: `${metrics.consistencyScore}%` }} className="h-full bg-green-500/50" />
                                            </div>
                                            <span className="text-[10px] text-muted-foreground mt-1">Consistency</span>
                                        </div>
                                    )}

                                    {hasAccess ? (
                                        <button
                                            onClick={() => router.push(`/app/coach/athlete/${athlete.id}`)}
                                            className="glass-elevated px-4 py-2 rounded-xl text-sm font-medium group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-all"
                                        >
                                            View Profile
                                        </button>
                                    ) : (
                                        <span className="text-sm text-muted-foreground italic flex items-center gap-1">
                                            <AlertTriangle className="h-3 w-3" />
                                            No Access
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </GlassCard>
        </div>
    );
}
