"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { dataStore } from "@/lib/data/store";
import { GlassCard } from "@/components/ui/glass-card";
import { User, Mail, Ruler, Scale, Heart, Activity } from "lucide-react";
import { athleteRepo } from "@/lib/data/repositories/athlete-repository";
import { PhysicalBaseline } from "@/lib/types/performance";

export default function AthleteProfilePage() {
    const { session } = useAuth();
    const [consent, setConsent] = useState(() => {
        if (!session.user) return { allowCoachView: false, allowClubView: false };
        return dataStore.getConsent(session.user.id) || { allowCoachView: false, allowClubView: false };
    });

    const [baseline, setBaseline] = useState<PhysicalBaseline>(() => {
        if (!session.user) return {};
        const profile = athleteRepo.getProfile(session.user.id);
        return profile?.baseline || {};
    });

    if (!session.user) return null;

    const handleConsentChange = (field: "allowCoachView" | "allowClubView", value: boolean) => {
        const updated = { ...consent, [field]: value };
        setConsent(updated);
        dataStore.updateConsent(session.user!.id, updated);
    };

    const handleBaselineChange = (field: keyof PhysicalBaseline, value: number) => {
        const updated = { ...baseline, [field]: value };
        setBaseline(updated);
        athleteRepo.updateProfile(session.user!.id, { baseline: updated });
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

            {/* Physical Baseline */}
            <GlassCard>
                <h3 className="font-bold mb-4">Physical Baseline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Height (cm)</label>
                        <div className="relative">
                            <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="number"
                                value={baseline.heightCm || ""}
                                onChange={(e) => handleBaselineChange("heightCm", parseFloat(e.target.value))}
                                className="glass w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                placeholder="175"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                        <div className="relative">
                            <Scale className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="number"
                                value={baseline.weightKg || ""}
                                onChange={(e) => handleBaselineChange("weightKg", parseFloat(e.target.value))}
                                className="glass w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                placeholder="70"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Resting HR</label>
                        <div className="relative">
                            <Heart className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="number"
                                value={baseline.restingHr || ""}
                                onChange={(e) => handleBaselineChange("restingHr", parseFloat(e.target.value))}
                                className="glass w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                placeholder="55"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Max HR</label>
                        <div className="relative">
                            <Activity className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="number"
                                value={baseline.maxHr || ""}
                                onChange={(e) => handleBaselineChange("maxHr", parseFloat(e.target.value))}
                                className="glass w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                placeholder="185"
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
