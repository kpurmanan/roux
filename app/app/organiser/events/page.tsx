"use client";

import { useAuth } from "@/lib/auth/context";
import { dataStore } from "@/lib/data/store";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusChip } from "@/components/ui/status-chip";
import { Calendar, Plus, ExternalLink, MapPin, Tag } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function OrganiserEventsPage() {
    const { session } = useAuth();

    if (!session.user) return null;

    const events = dataStore.getEventsByOrganiser(session.user.id);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">My Events</h1>
                    <p className="text-muted-foreground">Manage and monitor your upcoming and past events</p>
                </div>
                <Link href="/app/organiser/events/new">
                    <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                        <Plus className="h-5 w-5" />
                        Create Event
                    </button>
                </Link>
            </div>

            <div className="grid gap-4">
                {events.length === 0 ? (
                    <GlassCard className="py-12 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No events created yet</h3>
                        <p className="text-muted-foreground mb-6">Start your journey by creating your first endurance event.</p>
                        <Link href="/app/organiser/events/new">
                            <button className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">
                                Create an Event Now →
                            </button>
                        </Link>
                    </GlassCard>
                ) : (
                    events.map((event) => {
                        const registrations = dataStore.getRegistrations({ eventId: event.id });
                        const statusVariant = {
                            Draft: "default" as const,
                            Published: "paid" as const,
                            Closed: "confirmed" as const,
                        };

                        return (
                            <GlassCard key={event.id} className="group hover:bg-white/5 transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-bold">{event.title}</h3>
                                            <StatusChip variant={statusVariant[event.status]}>
                                                {event.status}
                                            </StatusChip>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="h-4 w-4" />
                                                {formatDate(event.date)}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="h-4 w-4" />
                                                {event.city}, {event.country}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Tag className="h-4 w-4" />
                                                {event.type}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 pt-2">
                                            <div className="flex flex-col">
                                                <span className="text-2xl font-bold">{registrations.length}</span>
                                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Registrations</span>
                                            </div>
                                            <div className="h-8 w-px bg-white/10" />
                                            <div className="flex flex-col">
                                                <span className="text-2xl font-bold">
                                                    {Math.round((registrations.length / event.capacity) * 100)}%
                                                </span>
                                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Capacity</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button className="glass-elevated px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2">
                                            Edit Event
                                        </button>
                                        <button className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all">
                                            <ExternalLink className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </GlassCard>
                        );
                    })
                )}
            </div>
        </div>
    );
}
