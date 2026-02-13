"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "@/lib/auth/context";
import { dataStore } from "@/lib/data/store";
import { athleteRepo } from "@/lib/data/repositories/athlete-repository";
import { metricsRepo } from "@/lib/data/repositories/metrics-repository";
import { activityRepo } from "@/lib/data/repositories/activity-repository";
import { calculateTrainingLoad } from "@/lib/engine/metrics";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusChip } from "@/components/ui/status-chip";
import { Activity, MetricsSnapshot, PhysicalBaseline } from "@/lib/types/performance";
import { formatTime } from "@/lib/utils";
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
    Trophy, TrendingUp, Activity as ActivityIcon, Zap, AlertTriangle, Info, CheckCircle, Lock, ArrowLeft, Ruler, Scale, Heart
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CoachAthleteView({ params }: { params: Promise<{ id: string }> }) {
    const { session } = useAuth();
    const router = useRouter();
    const resolvedParams = use(params);
    const athleteId = resolvedParams.id;

    // State
    const [athlete, setAthlete] = useState<any>(null);
    const [metrics, setMetrics] = useState<MetricsSnapshot | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [baseline, setBaseline] = useState<PhysicalBaseline | null>(null);
    const [accessDenied, setAccessDenied] = useState(false);

    useEffect(() => {
        if (!session.user) return;

        // 1. Check Auth (Must be Coach)
        if (session.user.role !== "coach") {
            router.push("/");
            return;
        }

        // 2. Check Consent
        const consent = dataStore.getConsent(athleteId);
        if (!consent?.allowCoachView && !consent?.allowClubView) {
            setAccessDenied(true);
            return;
        }

        // 3. Load Data
        const user = dataStore.getUserById(athleteId);
        if (!user) return;

        setAthlete(user);

        const acts = activityRepo.getActivitiesByAthlete(athleteId);
        setActivities(acts);

        const snap = metricsRepo.getSnapshot(athleteId);
        setMetrics(snap || null);

        const profile = athleteRepo.getProfile(athleteId);
        if (profile?.baseline) setBaseline(profile.baseline);

    }, [session.user, athleteId, router]);

    if (!session.user) return null;

    if (accessDenied) {
        return (
            <div className="max-w-md mx-auto py-12 text-center">
                <GlassCard className="p-8 space-y-4">
                    <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-500">
                        <Lock className="h-8 w-8" />
                    </div>
                    <h2 className="text-xl font-bold">Access Denied</h2>
                    <p className="text-muted-foreground">
                        This athlete has not granted permission for coaches to view their performance data.
                    </p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
                    >
                        Go Back
                    </button>
                </GlassCard>
            </div>
        );
    }

    if (!athlete || !metrics) {
        return <div className="p-8 text-center">Loading athlete profile...</div>;
    }

    // Chart Data
    const chartData = activities
        .filter(a => new Date(a.timestamp) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))
        .map(a => ({
            date: new Date(a.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            load: Math.round(calculateTrainingLoad(a)),
            type: a.type
        }))
        .reverse();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold">{athlete.name}</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{athlete.email}</span>
                        {metrics.performanceDna?.map(dna => (
                            <span key={dna} className="glass-elevated px-2 py-0.5 rounded-full text-xs font-bold text-white">
                                {dna}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Baseline Stats */}
            {baseline && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <GlassCard padding="sm" className="flex items-center gap-3">
                        <Ruler className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground uppercase">Height</p>
                            <p className="font-bold">{baseline.heightCm || "--"} cm</p>
                        </div>
                    </GlassCard>
                    <GlassCard padding="sm" className="flex items-center gap-3">
                        <Scale className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground uppercase">Weight</p>
                            <p className="font-bold">{baseline.weightKg || "--"} kg</p>
                        </div>
                    </GlassCard>
                    <GlassCard padding="sm" className="flex items-center gap-3">
                        <Heart className="h-5 w-5 text-red-400" />
                        <div>
                            <p className="text-xs text-muted-foreground uppercase">Resting HR</p>
                            <p className="font-bold">{baseline.restingHr || "--"} bpm</p>
                        </div>
                    </GlassCard>
                    <GlassCard padding="sm" className="flex items-center gap-3">
                        <ActivityIcon className="h-5 w-5 text-purple-400" />
                        <div>
                            <p className="text-xs text-muted-foreground uppercase">Max HR</p>
                            <p className="font-bold">{baseline.maxHr || "--"} bpm</p>
                        </div>
                    </GlassCard>
                </div>
            )}

            {/* Main KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <GlassCard padding="sm">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">AC Ratio</span>
                        <div className="flex items-end gap-2">
                            <span className={`text-2xl font-bold ${metrics.acRatio > 1.3 ? "text-yellow-400" :
                                metrics.acRatio < 0.8 ? "text-blue-400" : "text-green-400"
                                }`}>
                                {metrics.acRatio.toFixed(2)}
                            </span>
                            <span className="text-xs mb-1 text-muted-foreground">
                                {metrics.acRatio > 1.3 ? "Risk" : metrics.acRatio < 0.8 ? "Low" : "Optimal"}
                            </span>
                        </div>
                    </div>
                </GlassCard>
                <GlassCard padding="sm">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Consistency</span>
                        <span className="text-2xl font-bold">{Math.round(metrics.consistencyScore)}%</span>
                    </div>
                </GlassCard>
                <GlassCard padding="sm">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Chronic Load</span>
                        <span className="text-2xl font-bold">{Math.round(metrics.chronicLoad)}</span>
                    </div>
                </GlassCard>
                <GlassCard padding="sm">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Acute Load</span>
                        <span className="text-2xl font-bold">{Math.round(metrics.acuteLoad)}</span>
                    </div>
                </GlassCard>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Insights Panel */}
                <div className="md:col-span-1 space-y-4">
                    <GlassCard>
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Zap className="h-4 w-4 text-yellow-500" />
                            Generated Insights
                        </h3>
                        <div className="space-y-3">
                            {metrics.insights.map((insight) => (
                                <div key={insight.id} className={`p-3 rounded-lg border text-sm ${insight.type === 'Warning' ? 'bg-red-500/10 border-red-500/20' :
                                    insight.type === 'Positive' ? 'bg-green-500/10 border-green-500/20' :
                                        'bg-blue-500/10 border-blue-500/20'
                                    }`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        {insight.type === 'Warning' && <AlertTriangle className="h-3 w-3 text-red-400" />}
                                        {insight.type === 'Positive' && <CheckCircle className="h-3 w-3 text-green-400" />}
                                        {insight.type === 'Neutral' && <Info className="h-3 w-3 text-blue-400" />}
                                        <span className="font-semibold">{insight.title}</span>
                                    </div>
                                    <p className="text-muted-foreground text-xs leading-relaxed">{insight.description}</p>
                                </div>
                            ))}
                            {metrics.insights.length === 0 && (
                                <p className="text-sm text-muted-foreground py-4 text-center">No insights available.</p>
                            )}
                        </div>
                    </GlassCard>
                </div>

                {/* Charts */}
                <div className="md:col-span-2 space-y-6">
                    <GlassCard>
                        <h3 className="font-bold mb-4">Training Load (90 Days)</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="rgba(255,255,255,0.3)"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        interval={6}
                                    />
                                    <YAxis
                                        stroke="rgba(255,255,255,0.3)"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{
                                            backgroundColor: "rgba(17, 25, 40, 0.9)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            borderRadius: "8px",
                                            fontSize: "12px"
                                        }}
                                    />
                                    <Bar dataKey="load" fill="#a855f7" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>

                    <GlassCard>
                        <h3 className="font-bold mb-4">Recent Activities</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                            {activities.slice(0, 10).map(act => (
                                <div key={act.id} className="flex items-center justify-between p-3 glass-subtle rounded-xl text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className={`mt-0.5 p-1.5 rounded-full ${act.type === 'Run' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                            <ActivityIcon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{act.name}</p>
                                            <div className="flex gap-2 text-xs text-muted-foreground">
                                                <span>{new Date(act.timestamp).toLocaleDateString()}</span>
                                                <span>• {formatTime(act.durationSec)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Load</div>
                                        <div className="font-mono font-bold">{Math.round(calculateTrainingLoad(act))}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
