"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";
import { dataStore } from "@/lib/data/store";
import { activityRepo } from "@/lib/data/repositories/activity-repository";
import { metricsRepo } from "@/lib/data/repositories/metrics-repository";
import { refreshAthleteMetrics, calculateTrainingLoad } from "@/lib/engine/metrics";
import { Activity, MetricsSnapshot } from "@/lib/types/performance";
import { formatTime } from "@/lib/utils";
import { GlassCard } from "@/components/ui/glass-card";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
    Trophy, Activity as ActivityIcon,
    Zap, AlertTriangle, Info, CheckCircle
} from "lucide-react";

export default function AthletePerformancePage() {
    const { session } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [metrics, setMetrics] = useState<MetricsSnapshot | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        setMounted(true);
        if (session.user) {
            // Fetch activities
            const acts = activityRepo.getActivitiesByAthlete(session.user.id);
            setActivities(acts);

            // Calculate real-time metrics
            const snapshot = refreshAthleteMetrics(session.user.id, acts);
            metricsRepo.saveMetrics(snapshot);
            setMetrics(snapshot);
        }
    }, [session.user]);

    if (!mounted || !session.user) return null;

    const results = dataStore.getResults({ athleteId: session.user.id });

    // Alternative: Generate 90-day chart from activities
    const chartData = activities
        .filter(a => new Date(a.timestamp) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))
        .map(a => ({
            date: new Date(a.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            load: Math.round(a.durationSec / 60 * (a.rpe || 5) / 10 * 2), // Approx load
            type: a.type
        }))
        .reverse();

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Performance Intelligence</h1>
                    <p className="text-muted-foreground">Analysing your training load and race readiness</p>
                </div>
                {metrics?.performanceDna && (
                    <div className="flex gap-2">
                        {metrics.performanceDna.map(dna => (
                            <span key={dna} className="glass-elevated px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
                                🧬 {dna}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Main KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <GlassCard padding="sm">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">AC Ratio</span>
                        <div className="flex items-end gap-2">
                            <span className={`text-2xl font-bold ${(metrics?.acRatio || 0) > 1.3 ? "text-yellow-400" :
                                (metrics?.acRatio || 0) < 0.8 ? "text-blue-400" : "text-green-400"
                                }`}>
                                {metrics?.acRatio !== undefined ? (metrics.acRatio > 1.3 ? "Overreaching" : metrics.acRatio < 0.8 ? "Detraining" : "Optimal") : "N/A"}
                            </span>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard padding="sm">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Consistency</span>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold">{Math.round(metrics?.consistencyScore || 0)}%</span>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard padding="sm">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Chronic Load</span>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold">{Math.round(metrics?.chronicLoad || 0)}</span>
                            <span className="text-xs mb-1 text-muted-foreground">Fitness</span>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard padding="sm">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Acute Load</span>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold">{Math.round(metrics?.acuteLoad || 0)}</span>
                            <span className="text-xs mb-1 text-muted-foreground">Fatigue</span>
                        </div>
                    </div>
                </GlassCard>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Insights Panel */}
                <div className="md:col-span-1 space-y-4">
                    <GlassCard>
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Zap className="h-4 w-4 text-yellow-500" />
                            AI Insights
                        </h3>
                        <div className="space-y-3">
                            {metrics?.insights.map((insight) => (
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
                            {metrics?.insights.length === 0 && (
                                <p className="text-sm text-muted-foreground py-4 text-center">No insights available yet.</p>
                            )}
                        </div>
                    </GlassCard>

                    <GlassCard>
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-purple-500" />
                            Race Results
                        </h3>
                        <div className="space-y-3">
                            {results.slice(0, 3).map(r => (
                                <div key={r.id} className="flex justify-between items-center text-sm glass-subtle p-2 rounded">
                                    <span>{dataStore.getEventById(r.eventId)?.title}</span>
                                    <span className="font-mono font-bold">{formatTime(r.chipTime)}</span>
                                </div>
                            ))}
                            {results.length === 0 && <p className="text-muted-foreground text-xs">No race results yet.</p>}
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
                        <h3 className="font-bold mb-4">Activity Log</h3>
                        <div className="space-y-2">
                            {activities.slice(0, 5).map(act => (
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
                                                {act.distanceMeters > 0 && <span>• {(act.distanceMeters / 1000).toFixed(1)}km</span>}
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
