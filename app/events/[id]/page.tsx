"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Users } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusChip } from "@/components/ui/status-chip";
import { dataStore } from "@/lib/data/store";
import { Event } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function EventDetailPage() {
    const params = useParams();
    const [event, setEvent] = useState<Event | null>(null);

    useEffect(() => {
        const eventData = dataStore.getEventById(params.id as string);
        setEvent(eventData || null);
    }, [params.id]);

    if (!event) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
                <p className="text-muted-foreground">Event not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
            {/* Header */}
            <header className="glass-subtle border-b border-border/50 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/events" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-5 w-5" />
                        Back to Events
                    </Link>
                    <Link href="/auth/sign-in" className="glass px-6 py-2 rounded-full font-medium hover:scale-105 transition-transform">
                        Sign In to Register
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <div
                className="h-96 bg-cover bg-center relative"
                style={{
                    backgroundImage: `url(${event.heroImage || "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200"})`,
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                <div className="container mx-auto px-4 h-full flex items-end pb-8 relative z-10">
                    <div>
                        <StatusChip variant="published" className="mb-4">{event.status}</StatusChip>
                        <h1 className="text-5xl font-bold mb-2">{event.title}</h1>
                        <p className="text-xl text-muted-foreground">{event.type}</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <GlassCard>
                            <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {event.description || "Join us for an unforgettable endurance experience. This event brings together athletes from around the world to compete in one of the most prestigious races on the calendar."}
                            </p>
                        </GlassCard>

                        <GlassCard>
                            <h2 className="text-2xl font-bold mb-4">Distance Options</h2>
                            <div className="space-y-3">
                                {event.distanceOptions.map((option) => (
                                    <div key={option.id} className="glass-subtle p-4 rounded-xl flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold">{option.distance}</p>
                                            <p className="text-sm text-muted-foreground">{option.capacity} spots available</p>
                                        </div>
                                        <p className="text-lg font-bold">${option.price}</p>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <GlassCard>
                            <h3 className="font-bold mb-4">Event Details</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">Location</p>
                                        <p className="text-muted-foreground">{event.city}, {event.country}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">Date</p>
                                        <p className="text-muted-foreground">{formatDate(event.date)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">Capacity</p>
                                        <p className="text-muted-foreground">{event.capacity.toLocaleString()} athletes</p>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>

                        <Link href="/auth/sign-up">
                            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-xl font-semibold hover:scale-[1.02] transition-transform text-white">
                                Register Now
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
