import { activityRepo } from "../data/repositories/activity-repository";
import { metricsRepo } from "../data/repositories/metrics-repository";
import { consentRepo } from "../data/repositories/consent-repository";
import { athleteRepo } from "../data/repositories/athlete-repository";
import { dataStore } from "../data/store";
import { Activity, ActivityType, AthletePerformanceProfile, Consent, MetricsSnapshot, PerformanceDNA } from "@/lib/types/performance";
import { generateId } from "@/lib/utils";

// Helper to generate activities
function generateActivitiesForAthlete(athleteId: string, days: number = 90): Activity[] {
    const activities: Activity[] = [];
    const now = new Date();

    for (let i = 0; i < days; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // Randomly skip days (rest days)
        if (Math.random() > 0.7) continue;

        const type: ActivityType = Math.random() > 0.1 ? "Run" : "Strength";
        const durationMin = 30 + Math.random() * 60;

        activities.push({
            id: generateId(),
            athleteId,
            type,
            provider: "Garmin",
            timestamp: date.toISOString(),
            name: `${type} - ${date.toLocaleDateString()}`,
            durationSec: durationMin * 60,
            distanceMeters: type === "Run" ? (durationMin / 6) * 1000 : 0, // Approx 6min/km
            avgHr: 130 + Math.random() * 25,
            maxHr: 160 + Math.random() * 20,
            cadence: type === "Run" ? 160 + Math.random() * 20 : undefined,
            elevationGainMeters: type === "Run" ? Math.random() * 150 : 0,
            rpe: Math.floor(Math.random() * 5) + 4
        });
    }
    return activities;
}

let seeded = false;

export function seedPerformanceData() {
    if (seeded) return;
    seeded = true;

    // 1. Get athletes from main store
    const users = dataStore.getUsers().filter(u => u.role === "athlete");

    const profiles: AthletePerformanceProfile[] = [];
    const consents: Consent[] = [];
    const snapshots: MetricsSnapshot[] = [];
    let allActivities: Activity[] = [];

    users.forEach(user => {
        // Create extended profile
        profiles.push({
            athleteId: user.id,
            baseline: {
                heightCm: 170 + Math.random() * 20,
                weightKg: 60 + Math.random() * 25,
                restingHr: 45 + Math.random() * 15,
                maxHr: 180 + Math.random() * 10,
                vo2Max: 45 + Math.random() * 20,
                preferredDistance: Math.random() > 0.5 ? "Marathon" : "Half",
            },
            injuries: [],
            readiness: [],
            connectedProviders: ["Garmin"]
        });

        // Create consent (mostly public for demo, but some private)
        consents.push({
            athleteId: user.id,
            allowCoachView: Math.random() > 0.3, // 70% chance enabled
            allowClubView: Math.random() > 0.3,
            lastUpdated: new Date().toISOString()
        });

        // Generate activities and metrics
        const athleteActivities = generateActivitiesForAthlete(user.id);
        allActivities = [...allActivities, ...athleteActivities];

        // Mock snapshot
        snapshots.push({
            athleteId: user.id,
            date: new Date().toISOString(),
            acuteLoad: 400 + Math.random() * 200,
            chronicLoad: 350 + Math.random() * 200,
            acRatio: 0.8 + Math.random() * 0.5, // 0.8 - 1.3 range
            consistencyScore: 80 + Math.random() * 20,
            rampRate: Math.random() * 50 - 25,
            performanceDna: ["Consistency King", "Endurance Monster"],
            insights: [
                {
                    id: generateId(),
                    type: "Positive",
                    title: "Solid Consistency",
                    description: "You've trained 4 weeks in a row without missing a session.",
                    metric: "Consistency"
                },
                {
                    id: generateId(),
                    type: "Warning",
                    title: "Watch Fatigue",
                    description: "Acute load is high. Consider a rest day.",
                    metric: "AC Ratio",
                    value: "1.35"
                }
            ]
        });
    });

    // Seed repositories
    athleteRepo._seed(profiles);
    consentRepo._seed(consents);
    activityRepo._seed(allActivities);
    metricsRepo._seed(snapshots);

    console.log(`✅ Performance Data Seeded: ${profiles.length} profiles, ${allActivities.length} activities.`);
}
