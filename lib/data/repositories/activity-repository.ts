import { Activity } from "@/lib/types/performance";
import { generateId } from "@/lib/utils";

class ActivityRepository {
    private activities: Activity[] = [];

    constructor() {
        // Initial seed will be loaded via seed script
    }

    getActivitiesByAthlete(athleteId: string): Activity[] {
        return this.activities
            .filter((a) => a.athleteId === athleteId)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    getActivityById(id: string): Activity | undefined {
        return this.activities.find((a) => a.id === id);
    }

    createActivity(activityData: Omit<Activity, "id">): Activity {
        const newActivity: Activity = {
            ...activityData,
            id: generateId(),
        };
        this.activities.unshift(newActivity);
        return newActivity;
    }

    deleteActivity(id: string): boolean {
        const initialLength = this.activities.length;
        this.activities = this.activities.filter((a) => a.id !== id);
        return this.activities.length !== initialLength;
    }

    // Connectors simulation
    importFromProvider(athleteId: string, provider: Activity["provider"], count: number = 5): Activity[] {
        const newActivities: Activity[] = [];
        const now = new Date();

        for (let i = 0; i < count; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            newActivities.push({
                id: generateId(),
                athleteId,
                type: "Run",
                provider,
                timestamp: date.toISOString(),
                name: `Morning ${provider} Run`,
                durationSec: 1800 + Math.random() * 3600, // 30-90 mins
                distanceMeters: 5000 + Math.random() * 10000, // 5-15km
                avgHr: 130 + Math.random() * 30,
                maxHr: 160 + Math.random() * 20,
                cadence: 160 + Math.random() * 20,
                elevationGainMeters: Math.random() * 200,
                rpe: Math.floor(Math.random() * 5) + 5
            });
        }

        this.activities.push(...newActivities);
        return newActivities;
    }

    // For seeding
    _seed(activities: Activity[]) {
        this.activities = activities;
    }
}

export const activityRepo = new ActivityRepository();
