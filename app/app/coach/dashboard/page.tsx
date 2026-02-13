"use client";

import { useAuth } from "@/lib/auth/context";
import { dataStore } from "@/lib/data/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Users, Trophy, TrendingUp, Award } from "lucide-react";

export default function CoachDashboardPage() {
    const { session } = useAuth();

    if (!session.user) return null;

    const club = session.user.clubId ? dataStore.getClubById(session.user.clubId) : null;
    const athletes = club ? club.members.map((id) => dataStore.getUserById(id)).filter(Boolean) : [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Coach Dashboard</h1>
                <p className="text-muted-foreground">
                    {club ? `Managing ${club.name}` : "Manage your athletes"}
                </p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4">
                <GlassCard>
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="h-5 w-5 text-purple-400" />
                        <span className="text-sm text-muted-foreground">Total Athletes</span>
                    </div>
                    <p className="text-3xl font-bold">{athletes.length}</p>
                </GlassCard>
                <GlassCard>
                    <div className="flex items-center gap-3 mb-2">
                        <Trophy className="h-5 w-5 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">Active Races</span>
                    </div>
                    <p className="text-3xl font-bold">12</p>
                </GlassCard>
                <GlassCard>
                    <div className="flex items-center gap-3 mb-2">
                        <Award className="h-5 w-5 text-green-400" />
                        <span className="text-sm text-muted-foreground">Personal Bests</span>
                    </div>
                    <p className="text-3xl font-bold">8</p>
                </GlassCard>
            </div>

            {/* Roster */}
            <GlassCard>
                <h3 className="font-bold mb-4">Athlete Roster</h3>
                <div className="space-y-3">
                    {athletes.map((athlete: any) => {
                        const consent = dataStore.getConsent(athlete.id);
                        const hasAccess = consent?.allowCoachView || consent?.allowClubView;

                        return (
                            <div key={athlete.id} className="glass-subtle p-4 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                        {athlete.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{athlete.name}</p>
                                        <p className="text-sm text-muted-foreground">{athlete.email}</p>
                                    </div>
                                </div>
                                {hasAccess ? (
                                    <button className="glass-elevated px-4 py-2 rounded-xl text-sm font-medium hover:scale-105 transition-transform">
                                        View Profile
                                    </button>
                                ) : (
                                    <span className="text-sm text-muted-foreground">No access</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </GlassCard>
        </div>
    );
}
