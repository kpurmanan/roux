"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, MapPin, Calendar, Trophy } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusChip } from "@/components/ui/status-chip";
import { ThemeToggle } from "@/components/theme-toggle";
import { dataStore } from "@/lib/data/store";
import { formatDate } from "@/lib/utils";
import { EventCardSkeleton } from "@/components/ui/loading-skeleton";

export default function EventsPage() {
    const [loading, setLoading] = useState(false);
    const events = dataStore.getEvents({ status: "Published" });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
            {/* Header */}
            <header className="glass-subtle border-b border-border/50 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Trophy className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold gradient-text">PacePass</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link
                            href="/auth/sign-in"
                            className="glass px-6 py-2 rounded-full font-medium hover:scale-105 transition-transform"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Search and Filters */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">Discover Events</h1>
                    <p className="text-muted-foreground mb-6">
                        Find your next challenge from world-class endurance events
                    </p>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                className="glass w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <button className="glass px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Events Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <>
                            <EventCardSkeleton />
                            <EventCardSkeleton />
                            <EventCardSkeleton />
                        </>
                    ) : (
                        events.map((event) => (
                            <Link key={event.id} href={`/events/${event.id}`}>
                                <GlassCard variant="interactive" padding="none" className="overflow-hidden h-full">
                                    <div
                                        className="h-48 bg-cover bg-center"
                                        style={{
                                            backgroundImage: `url(${event.heroImage || "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800"})`,
                                        }}
                                    >
                                        <div className="h-full bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                                            <StatusChip variant="published">{event.status}</StatusChip>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                {event.city}, {event.country}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                {formatDate(event.date)}
                                            </div>
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            {event.distanceOptions.slice(0, 2).map((d) => (
                                                <span
                                                    key={d.id}
                                                    className="glass-subtle px-3 py-1 rounded-full text-xs font-medium"
                                                >
                                                    {d.distance}
                                                </span>
                                            ))}
                                            {event.distanceOptions.length > 2 && (
                                                <span className="glass-subtle px-3 py-1 rounded-full text-xs font-medium">
                                                    +{event.distanceOptions.length - 2} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </GlassCard>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
