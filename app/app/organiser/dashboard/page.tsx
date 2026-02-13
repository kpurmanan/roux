"use client";

import { useAuth } from "@/lib/auth/context";
import { dataStore } from "@/lib/data/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Trophy, Users, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function OrganiserDashboardPage() {
    const { session } = useAuth();

    if (!session.user) return null;

    const myEvents = dataStore.getEventsByOrganiser(session.user.id);
    const allRegistrations = myEvents.flatMap((event) =>
        dataStore.getRegistrations({ eventId: event.id })
    );

    const stats = {
        totalEvents: myEvents.length,
        publishedEvents: myEvents.filter((e) => e.status === "Published").length,
        totalRegistrations: allRegistrations.length,
        confirmedRegistrations: allRegistrations.filter((r) => r.status === "Confirmed").length,
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Organiser Dashboard</h1>
                <p className="text-muted-foreground">Manage your events and registrations</p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4">
                <GlassCard>
                    <div className="flex items-center gap-3 mb-2">
                        <Trophy className="h-5 w-5 text-purple-400" />
                        <span className="text-sm text-muted-foreground">Total Events</span>
                    </div>
                    <p className="text-3xl font-bold">{stats.totalEvents}</p>
                </GlassCard>
                <GlassCard>
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar className="h-5 w-5 text-green-400" />
                        <span className="text-sm text-muted-foreground">Published</span>
                    </div>
                    <p className="text-3xl font-bold">{stats.publishedEvents}</p>
                </GlassCard>
                <GlassCard>
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="h-5 w-5 text-blue-400" />
                        <span className="text-sm text-muted-foreground">Registrations</span>
                    </div>
                    <p className="text-3xl font-bold">{stats.totalRegistrations}</p>
                </GlassCard>
                <GlassCard>
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="h-5 w-5 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">Confirmed</span>
                    </div>
                    <p className="text-3xl font-bold">{stats.confirmedRegistrations}</p>
                </GlassCard>
            </div>

            {/* Quick Actions */}
            <GlassCard>
                <h3 className="font-bold mb-4">Quick Actions</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <Link href="/app/organiser/events/new">
                        <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-xl font-semibold hover:scale-[1.02] transition-transform text-white">
                            Create New Event
                        </button>
                    </Link>
                    <button className="w-full glass-elevated py-4 rounded-xl font-semibold hover:scale-[1.02] transition-transform">
                        View All Registrations
                    </button>
                </div>
            </GlassCard>

            {/* Recent Events */}
            <GlassCard>
                <h3 className="font-bold mb-4">Your Events</h3>
                <div className="space-y-3">
                    {myEvents.slice(0, 5).map((event) => {
                        const registrations = dataStore.getRegistrations({ eventId: event.id });
                        return (
                            <div key={event.id} className="glass-subtle p-4 rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-semibold">{event.title}</p>
                                    <span className="text-sm text-muted-foreground">{formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>{event.city}, {event.country}</span>
                                    <span>•</span>
                                    <span>{registrations.length} registrations</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </GlassCard>
        </div>
    );
}
