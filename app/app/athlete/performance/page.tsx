"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";
import { dataStore } from "@/lib/data/store";
import { GlassCard } from "@/components/ui/glass-card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Trophy, TrendingUp, Award } from "lucide-react";
import { formatTime } from "@/lib/utils";

export default function AthletePerformancePage() {
    const { session } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !session.user) return null;

    const results = dataStore.getResults({ athleteId: session.user.id });

    // Mock performance data
    const performanceData = [
        { race: "Race 1", time: 10800 },
        { race: "Race 2", time: 10740 },
        { race: "Race 3", time: 10680 },
        { race: "Race 4", time: 10620 },
        { race: "Race 5", time: 10560 },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Performance</h1>
                <p className="text-muted-foreground">Track your progress and achievements</p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4">
                <GlassCard>
                    <div className="flex items-center gap-3 mb-2">
                        <Trophy className="h-5 w-5 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">Total Races</span>
                    </div>
                    <p className="text-3xl font-bold">{results.length}</p>
                </GlassCard>
                <GlassCard>
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="h-5 w-5 text-green-400" />
                        <span className="text-sm text-muted-foreground">Personal Bests</span>
                    </div>
                    <p className="text-3xl font-bold">{results.filter((r) => r.pbFlag).length}</p>
                </GlassCard>
                <GlassCard>
                    <div className="flex items-center gap-3 mb-2">
                        <Award className="h-5 w-5 text-purple-400" />
                        <span className="text-sm text-muted-foreground">Best Time</span>
                    </div>
                    <p className="text-3xl font-bold">
                        {results.length > 0 ? formatTime(Math.min(...results.map((r) => r.chipTime))) : "--:--"}
                    </p>
                </GlassCard>
            </div>

            {/* Chart */}
            <GlassCard>
                <h3 className="font-bold mb-4">Time Progression</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="race" stroke="rgba(255,255,255,0.5)" />
                            <YAxis stroke="rgba(255,255,255,0.5)" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(17, 25, 40, 0.9)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "12px",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="time"
                                stroke="#a855f7"
                                strokeWidth={2}
                                dot={{ fill: "#a855f7", r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>

            {/* Recent Results */}
            {results.length > 0 && (
                <GlassCard>
                    <h3 className="font-bold mb-4">Recent Results</h3>
                    <div className="space-y-3">
                        {results.map((result) => {
                            const event = dataStore.getEventById(result.eventId);
                            return (
                                <div key={result.id} className="glass-subtle p-4 rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-semibold">{event?.title}</p>
                                        {result.pbFlag && (
                                            <span className="glass-elevated px-3 py-1 rounded-full text-xs font-medium text-yellow-400">
                                                PB
                                            </span>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Chip Time</p>
                                            <p className="font-medium">{formatTime(result.chipTime)}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Overall Rank</p>
                                            <p className="font-medium">#{result.rankOverall}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Gender Rank</p>
                                            <p className="font-medium">#{result.rankGender}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </GlassCard>
            )}
        </div>
    );
}
