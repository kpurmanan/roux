import { Consent } from "@/lib/types/performance";

class ConsentRepository {
    private consents: Map<string, Consent> = new Map(); // athleteId -> Constraint

    getConsent(athleteId: string): Consent | undefined {
        return this.consents.get(athleteId);
    }

    updateConsent(athleteId: string, updates: Partial<Consent>): Consent {
        const current = this.consents.get(athleteId) || {
            athleteId,
            allowCoachView: false,
            allowClubView: false,
            lastUpdated: new Date().toISOString()
        };

        const updated = { ...current, ...updates, lastUpdated: new Date().toISOString() };
        this.consents.set(athleteId, updated);
        return updated;
    }

    // Check access helper
    canCoachView(athleteId: string, coachId: string): boolean {
        const consent = this.getConsent(athleteId);
        // In real app, we'd check if coachId matches linkedCoachId
        // For mock, we just check the boolean flag
        return !!consent?.allowCoachView;
    }

    canClubView(athleteId: string, clubId: string): boolean {
        const consent = this.getConsent(athleteId);
        return !!consent?.allowClubView;
    }

    // For seeding
    _seed(consents: Consent[]) {
        consents.forEach(c => this.consents.set(c.athleteId, c));
    }
}

export const consentRepo = new ConsentRepository();
