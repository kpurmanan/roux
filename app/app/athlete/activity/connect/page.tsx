"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { athleteRepo } from "@/lib/data/repositories/athlete-repository";
import { GlassCard } from "@/components/ui/glass-card";
import { Check, Plus, Smartphone, Watch } from "lucide-react";

const PROVIDERS = [
    { id: "Garmin", name: "Garmin Connect", icon: Watch, color: "bg-blue-500" },
    { id: "Strava", name: "Strava", icon: Smartphone, color: "bg-orange-500" },
    { id: "AppleHealth", name: "Apple Health", icon: Smartphone, color: "bg-red-500" },
    { id: "Coros", name: "COROS", icon: Watch, color: "bg-yellow-500" },
] as const;

export default function ConnectAppsPage() {
    const { session } = useAuth();
    // Initialize from repo
    const [connected, setConnected] = useState<string[]>(() => {
        if (!session.user) return [];
        return athleteRepo.getProfile(session.user.id)?.connectedProviders || [];
    });

    if (!session.user) return null;

    const toggleProvider = (providerId: string) => {
        const isConnected = connected.includes(providerId);
        let newConnected: string[];

        if (isConnected) {
            newConnected = connected.filter(c => c !== providerId);
        } else {
            newConnected = [...connected, providerId];
        }

        setConnected(newConnected);
        athleteRepo.updateProfile(session.user!.id, { connectedProviders: newConnected });
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold mb-2">Connect Apps</h1>
                <p className="text-muted-foreground">Sync your training data from your favorite devices</p>
            </div>

            <div className="grid gap-4">
                {PROVIDERS.map((provider) => {
                    const isConnected = connected.includes(provider.id);
                    const Icon = provider.icon;
                    return (
                        <GlassCard key={provider.id} className="transition-all hover:bg-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${provider.color} bg-opacity-20 text-white shadow-lg`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{provider.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {isConnected ? "Syncing automatically" : "Not connected"}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleProvider(provider.id)}
                                    className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${isConnected
                                            ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                            : "bg-white/10 hover:bg-white/20"
                                        }`}
                                >
                                    {isConnected ? (
                                        <>
                                            <Check className="h-4 w-4" />
                                            Connected
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4" />
                                            Connect
                                        </>
                                    )}
                                </button>
                            </div>
                        </GlassCard>
                    );
                })}
            </div>

            <p className="text-center text-sm text-muted-foreground pt-4">
                PacePass respects your privacy. We only read activity data to calculate performance metrics.
            </p>
        </div>
    );
}
