"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { dataStore } from "@/lib/data/store";
import { GlassCard } from "@/components/ui/glass-card";
import { User, Mail, Save } from "lucide-react";

export default function AthleteProfilePage() {
    const { session, updateUser } = useAuth();
    const [consent, setConsent] = useState(() => {
        if (!session.user) return { allowCoachView: false, allowClubView: false };
        return dataStore.getConsent(session.user.id) || { allowCoachView: false, allowClubView: false };
    });

    if (!session.user) return null;

    const handleConsentChange = (field: "allowCoachView" | "allowClubView", value: boolean) => {
        const updated = { ...consent, [field]: value };
        setConsent(updated);
        dataStore.updateConsent(session.user!.id, updated);
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold mb-2">Profile</h1>
                <p className="text-muted-foreground">Manage your account and privacy settings</p>
            </div>

            {/* Profile Info */}
            <GlassCard>
                <h3 className="font-bold mb-4">Personal Information</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                value={session.user.name}
                                className="glass w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                readOnly
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="email"
                                value={session.user.email}
                                className="glass w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                readOnly
                            />
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Privacy Settings */}
            <GlassCard>
                <h3 className="font-bold mb-4">Privacy & Consent</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Control who can view your performance data and race history
                </p>
                <div className="space-y-4">
                    <div className="flex items-center justify-between glass-subtle p-4 rounded-xl">
                        <div>
                            <p className="font-medium">Allow Coach Access</p>
                            <p className="text-sm text-muted-foreground">
                                Let your coach view your performance data
                            </p>
                        </div>
                        <button
                            onClick={() => handleConsentChange("allowCoachView", !consent.allowCoachView)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${consent.allowCoachView ? "bg-green-500" : "bg-gray-600"
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${consent.allowCoachView ? "translate-x-6" : ""
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between glass-subtle p-4 rounded-xl">
                        <div>
                            <p className="font-medium">Allow Club Access</p>
                            <p className="text-sm text-muted-foreground">
                                Let your club view your performance data
                            </p>
                        </div>
                        <button
                            onClick={() => handleConsentChange("allowClubView", !consent.allowClubView)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${consent.allowClubView ? "bg-green-500" : "bg-gray-600"
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${consent.allowClubView ? "translate-x-6" : ""
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
