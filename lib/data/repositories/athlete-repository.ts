import { AthletePerformanceProfile, InjuryRecord, RaceReadiness } from "@/lib/types/performance";

class AthleteRepository {
    private profiles: Map<string, AthletePerformanceProfile> = new Map();

    getProfile(athleteId: string): AthletePerformanceProfile | undefined {
        return this.profiles.get(athleteId);
    }

    updateProfile(athleteId: string, updates: Partial<AthletePerformanceProfile>): AthletePerformanceProfile {
        const current = this.profiles.get(athleteId) || {
            athleteId,
            baseline: {},
            injuries: [],
            readiness: [],
            connectedProviders: []
        };

        // Deep merge logic could go here, but simple spread is enough for mock
        const updated = {
            ...current,
            ...updates,
            baseline: { ...current.baseline, ...updates.baseline }
        };

        this.profiles.set(athleteId, updated);
        return updated;
    }

    addInjury(athleteId: string, injury: InjuryRecord): void {
        const profile = this.getProfile(athleteId);
        if (profile) {
            profile.injuries.push(injury);
            this.profiles.set(athleteId, profile);
        }
    }

    addReadiness(athleteId: string, readiness: RaceReadiness): void {
        const profile = this.getProfile(athleteId);
        if (profile) {
            profile.readiness.unshift(readiness); // Newest first
            this.profiles.set(athleteId, profile);
        }
    }

    // For seeding
    _seed(profiles: AthletePerformanceProfile[]) {
        profiles.forEach(p => this.profiles.set(p.athleteId, p));
    }
}

export const athleteRepo = new AthleteRepository();
