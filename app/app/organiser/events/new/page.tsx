"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { dataStore } from "@/lib/data/store";
import { GlassCard } from "@/components/ui/glass-card";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Event, EventType } from "@/lib/types";
import { generateId } from "@/lib/utils";

export default function NewEventPage() {
    const router = useRouter();
    const { session } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: "",
        type: "Marathon" as EventType,
        date: "",
        city: "",
        country: "",
        timezone: "UTC",
        description: "",
    });

    if (!session.user) return null;

    const handleSubmit = () => {
        if (!formData.date) {
            alert("Please select a date for the event.");
            return;
        }
        const newEvent: Event = {
            id: generateId(),
            organiserId: session.user!.id,
            title: formData.title,
            type: formData.type,
            date: new Date(formData.date),
            city: formData.city,
            country: formData.country,
            timezone: formData.timezone,
            distanceOptions: [
                { id: generateId(), distance: "42.2km", capacity: 10000, price: 150 },
            ],
            capacity: 10000,
            priceTiers: [
                { id: generateId(), name: "Early Bird", price: 120, validUntil: new Date() },
            ],
            status: "Draft",
            description: formData.description,
            createdAt: new Date(),
        };

        dataStore.createEvent(newEvent);
        router.push("/app/organiser/dashboard");
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Create New Event</h1>
                <p className="text-muted-foreground">Step {step} of 5</p>
            </div>

            {/* Progress */}
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                    <div
                        key={s}
                        className={`h-2 flex-1 rounded-full ${s <= step ? "bg-gradient-to-r from-purple-500 to-pink-500" : "glass-subtle"
                            }`}
                    />
                ))}
            </div>

            <GlassCard variant="elevated">
                {step === 1 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold mb-4">Event Basics</h2>
                        <div>
                            <label className="block text-sm font-medium mb-2">Event Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="glass w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="London Marathon 2026"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Event Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType })}
                                className="glass w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="Marathon">Marathon</option>
                                <option value="Half Marathon">Half Marathon</option>
                                <option value="10K">10K</option>
                                <option value="5K">5K</option>
                                <option value="Triathlon">Triathlon</option>
                                <option value="Ultra Marathon">Ultra Marathon</option>
                            </select>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">City</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="glass w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="London"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Country</label>
                                <input
                                    type="text"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    className="glass w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="United Kingdom"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Event Date</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="glass w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold mb-4">Distances & Capacity</h2>
                        <p className="text-muted-foreground">Configure distance options for your event</p>
                        <div className="glass-subtle p-4 rounded-xl">
                            <p className="text-sm text-muted-foreground">Distance configuration will be available in the full version</p>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold mb-4">Pricing Tiers</h2>
                        <p className="text-muted-foreground">Set up pricing for your event</p>
                        <div className="glass-subtle p-4 rounded-xl">
                            <p className="text-sm text-muted-foreground">Pricing configuration will be available in the full version</p>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold mb-4">Branding</h2>
                        <div>
                            <label className="block text-sm font-medium mb-2">Event Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="glass w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-32"
                                placeholder="Describe your event..."
                            />
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold mb-4">Review & Publish</h2>
                        <div className="glass-subtle p-4 rounded-xl space-y-2">
                            <p><strong>Title:</strong> {formData.title}</p>
                            <p><strong>Type:</strong> {formData.type}</p>
                            <p><strong>Location:</strong> {formData.city}, {formData.country}</p>
                            <p><strong>Date:</strong> {formData.date}</p>
                        </div>
                    </div>
                )}

                <div className="flex gap-4 mt-6">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="glass-elevated px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform flex items-center gap-2"
                        >
                            <ArrowLeft className="h-5 w-5" /> Back
                        </button>
                    )}
                    {step < 5 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-xl font-semibold hover:scale-[1.02] transition-transform text-white flex items-center justify-center gap-2"
                        >
                            Next <ArrowRight className="h-5 w-5" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-xl font-semibold hover:scale-[1.02] transition-transform text-white"
                        >
                            Create Event
                        </button>
                    )}
                </div>
            </GlassCard>
        </div>
    );
}
