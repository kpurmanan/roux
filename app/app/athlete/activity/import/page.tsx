"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { activityRepo } from "@/lib/data/repositories/activity-repository";
import { athleteRepo } from "@/lib/data/repositories/athlete-repository";
import { metricsRepo } from "@/lib/data/repositories/metrics-repository";
import { refreshAthleteMetrics } from "@/lib/engine/metrics";
import { GlassCard } from "@/components/ui/glass-card";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, Smartphone, Download, ArrowRight } from "lucide-react";

export default function ImportActivitiesPage() {
    const { session } = useAuth();
    const router = useRouter();
    const [status, setStatus] = useState<"idle" | "syncing" | "complete">("idle");
    const [progress, setProgress] = useState(0);
    const [importedCount, setImportedCount] = useState(0);

    if (!session.user) return null;

    const profile = athleteRepo.getProfile(session.user.id);
    const connectedProviders = profile?.connectedProviders || [];

    const handleImport = async () => {
        if (!session.user) return;

        if (connectedProviders.length === 0) {
            router.push("/app/athlete/activity/connect");
            return;
        }

        setStatus("syncing");

        // Simulate sync steps
        for (let i = 0; i <= 100; i += 10) {
            setProgress(i);
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Logic to actually import
        // activityRepo has `importFromProvider` method.
        // It returns the new activities.
        let totalNew = 0;
        connectedProviders.forEach(provider => {
            // TS safe cast for demo
            const p = provider as "Garmin" | "Strava" | "AppleHealth" | "Coros";
            const newActs = activityRepo.importFromProvider(session.user!.id, p, 10); // Import 10 recent
            totalNew += newActs.length;
        });

        // Refresh metrics
        const allActs = activityRepo.getActivitiesByAthlete(session.user.id);
        const snapshot = refreshAthleteMetrics(session.user.id, allActs);
        metricsRepo.saveMetrics(snapshot);

        setImportedCount(totalNew);
        setStatus("complete");
    };

    return (
        <div className="max-w-xl mx-auto py-12">
            <GlassCard className="text-center space-y-8 p-8">
                {status === "idle" && (
                    <>
                        <div className="mx-auto w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400">
                            <Download className="h-8 w-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Ready to Sync</h2>
                            <p className="text-muted-foreground mb-6">
                                {connectedProviders.length > 0
                                    ? `Connected to ${connectedProviders.join(", ")}`
                                    : "No providers connected"}
                            </p>

                            {connectedProviders.length > 0 ? (
                                <button
                                    onClick={handleImport}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-purple-500/20"
                                >
                                    Sync Now
                                </button>
                            ) : (
                                <button
                                    onClick={() => router.push("/app/athlete/activity/connect")}
                                    className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full font-medium"
                                >
                                    Connect a Provider
                                </button>
                            )}
                        </div>
                    </>
                )}

                {status === "syncing" && (
                    <>
                        <div className="mx-auto w-16 h-16 relative">
                            <Loader2 className="h-16 w-16 text-purple-500 animate-spin absolute top-0 left-0" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Syncing Activities...</h2>
                            <p className="text-muted-foreground mb-6">Fetching your latest training data</p>

                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-purple-500 h-full transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </>
                )}

                {status === "complete" && (
                    <>
                        <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                            <CheckCircle className="h-8 w-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Sync Complete</h2>
                            <p className="text-muted-foreground mb-6">
                                Successfully imported {importedCount} new activities.
                            </p>

                            <button
                                onClick={() => router.push("/app/athlete/performance")}
                                className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 mx-auto"
                            >
                                View Dashboard
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </>
                )}
            </GlassCard>
        </div>
    );
}
