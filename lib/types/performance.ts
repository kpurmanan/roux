
export type ActivityType = "Run" | "Ride" | "Swim" | "Strength" | "Other";

export interface Activity {
    id: string;
    athleteId: string;
    type: ActivityType;
    provider: "Garmin" | "Strava" | "AppleHealth" | "Coros" | "Manual";
    timestamp: string; // ISO date
    name: string;
    durationSec: number;
    distanceMeters: number;
    avgHr?: number;
    maxHr?: number;
    elevationGainMeters?: number;
    cadence?: number;
    rpe?: number; // 1-10
}

export interface InjuryRecord {
    id: string;
    type: string; // e.g., "IT Band Syndrome"
    side?: "Left" | "Right" | "Bilateral";
    startDate: string;
    endDate?: string;
    notes?: string;
    isActive: boolean;
}

export interface RaceReadiness {
    date: string; // ISO Date (YYYY-MM-DD)
    sleepQuality: number; // 1-5
    fatigue: number; // 1-10
    soreness: number; // 1-10
    stress: number; // 1-10
    illnessFlag: boolean;
    trainingCompliancePct: number; // 0-100
}

export interface PhysicalBaseline {
    heightCm?: number;
    weightKg?: number;
    restingHr?: number;
    maxHr?: number;
    vo2Max?: number;
    lactateThresholdPace?: number; // seconds per km
    preferredDistance?: "5K" | "10K" | "Half" | "Marathon" | "Ultra";
    primarySurface?: "Road" | "Trail" | "Track" | "Mixed";
}

export type PerformanceDNA =
    | "Speedster"
    | "Endurance Monster"
    | "Negative Splitter"
    | "Volume Responder"
    | "Consistency King"
    | "Balanced";

export interface MetricsSnapshot {
    athleteId: string;
    date: string; // ISO (usually "latest" or specific week)

    // Calculated stats
    acuteLoad: number; // 7-day
    chronicLoad: number; // 28-day
    acRatio: number; // Acute / Chronic

    consistencyScore: number; // 0-100
    rampRate: number; // week-over-week change in load

    predictedMarathonTime?: number; // seconds
    predictedHalfTime?: number; // seconds

    performanceDna: PerformanceDNA[];
    insights: Insight[];
}

export interface Insight {
    id: string;
    type: "Positive" | "Warning" | "Neutral";
    title: string;
    description: string;
    metric: string; // e.g., "AC Ratio"
    value?: string | number;
}

export interface Consent {
    athleteId: string;
    allowCoachView: boolean;
    allowClubView: boolean;
    linkedCoachId?: string;
    linkedClubId?: string;
    lastUpdated: string;
}

// Extended profile that wraps the base User but adds performance data
// This will likely be stored separately or linked in a real DB
export interface AthletePerformanceProfile {
    athleteId: string;
    baseline: PhysicalBaseline;
    injuries: InjuryRecord[];
    readiness: RaceReadiness[]; // History of daily check-ins
    connectedProviders: string[];
}
