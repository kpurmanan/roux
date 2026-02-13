"use client";

import { useAuth } from "@/lib/auth/context";
import { dataStore } from "@/lib/data/store";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusChip } from "@/components/ui/status-chip";
import { EmptyState } from "@/components/ui/empty-state";
import { Calendar, MapPin, Award } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function AthleteEventsPage() {
    const { session } = useAuth();

    if (!session.user) return null;

    const registrations = dataStore.getRegistrations({ athleteId: session.user.id });
    const eventsWithRegistrations = registrations.map((reg) => ({
        registration: reg,
        event: dataStore.getEventById(reg.eventId)!,
    }));

    const statusVariantMap: Record<string, any> = {
        Pending: "pending",
        Paid: "paid",
        Confirmed: "confirmed",
        CheckedIn: "checkedIn",
        Finished: "finished",
        Cancelled: "cancelled",
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">My Events</h1>
                <p className="text-muted-foreground">Track your registrations and upcoming races</p>
            </div>

            {eventsWithRegistrations.length === 0 ? (
                <EmptyState
                    icon={Calendar}
                    title="No events yet"
                    description="You haven't registered for any events. Browse the catalog to find your next challenge!"
                    action={
                        <Link href="/events">
                            <button className="glass-elevated px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform">
                                Browse Events
                            </button>
                        </Link>
                    }
                />
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {eventsWithRegistrations.map(({ registration, event }) => (
                        <GlassCard key={registration.id} variant="interactive" className="relative">
                            <div className="absolute top-6 right-6">
                                <StatusChip variant={statusVariantMap[registration.status]}>
                                    {registration.status}
                                </StatusChip>
                            </div>

                            <h3 className="text-xl font-bold mb-4 pr-24">{event.title}</h3>

                            <div className="space-y-2 text-sm text-muted-foreground mb-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    {event.city}, {event.country}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(event.date)}
                                </div>
                            </div>

                            {registration.bibNumber && (
                                <div className="glass-subtle p-4 rounded-xl mb-4">
                                    <p className="text-xs text-muted-foreground mb-1">Bib Number</p>
                                    <p className="text-2xl font-bold">{registration.bibNumber}</p>
                                </div>
                            )}

                            <Link href={`/app/athlete/race-pass/${event.id}`}>
                                <button className="w-full glass-elevated py-3 rounded-xl font-medium hover:scale-[1.02] transition-transform">
                                    View Race Pass
                                </button>
                            </Link>
                        </GlassCard>
                    ))}
                </div>
            )}
        </div>
    );
}
