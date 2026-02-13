"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { dataStore } from "@/lib/data/store";
import { GlassCard } from "@/components/ui/glass-card";
import { QrCode, CheckCircle2, Package, MapPin, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function RacePassPage() {
    const params = useParams();
    const { session } = useAuth();

    if (!session.user) return null;

    const event = dataStore.getEventById(params.eventId as string);
    const registration = dataStore
        .getRegistrations({ eventId: params.eventId as string, athleteId: session.user.id })
    [0];

    if (!event || !registration) {
        return <div>Registration not found</div>;
    }

    const checklist = [
        { id: 1, label: "Packet Pickup", completed: registration.status === "CheckedIn" || registration.status === "Finished" },
        { id: 2, label: "Gear Check", completed: false },
        { id: 3, label: "Travel Arrangements", completed: false },
    ];

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold mb-2">Race Day Pass</h1>
                <p className="text-muted-foreground">{event.title}</p>
            </div>

            {/* QR Code */}
            <GlassCard variant="elevated" className="text-center">
                <div className="inline-flex items-center justify-center w-48 h-48 glass-subtle rounded-2xl mb-4">
                    <QrCode className="h-32 w-32 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Scan at packet pickup</p>
            </GlassCard>

            {/* Bib & Logistics */}
            <div className="grid grid-cols-2 gap-4">
                <GlassCard>
                    <p className="text-sm text-muted-foreground mb-1">Bib Number</p>
                    <p className="text-3xl font-bold">{registration.bibNumber || "TBA"}</p>
                </GlassCard>
                <GlassCard>
                    <p className="text-sm text-muted-foreground mb-1">Logistics ID</p>
                    <p className="text-3xl font-bold">{registration.logisticsId || "TBA"}</p>
                </GlassCard>
            </div>

            {/* Event Details */}
            <GlassCard>
                <h3 className="font-bold mb-4">Event Details</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="font-medium">Location</p>
                            <p className="text-muted-foreground">{event.city}, {event.country}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="font-medium">Date</p>
                            <p className="text-muted-foreground">{formatDate(event.date)}</p>
                        </div>
                    </div>
                    {registration.wave && (
                        <div className="flex items-center gap-3">
                            <Package className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Wave</p>
                                <p className="text-muted-foreground">{registration.wave}</p>
                            </div>
                        </div>
                    )}
                </div>
            </GlassCard>

            {/* Checklist */}
            <GlassCard>
                <h3 className="font-bold mb-4">Race Day Checklist</h3>
                <div className="space-y-3">
                    {checklist.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-3 glass-subtle p-3 rounded-xl"
                        >
                            <CheckCircle2
                                className={`h-5 w-5 ${item.completed ? "text-green-400" : "text-muted-foreground"}`}
                            />
                            <span className={item.completed ? "line-through text-muted-foreground" : ""}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
}
