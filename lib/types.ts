// User roles
export type UserRole = "organiser" | "athlete" | "coach";

// Event types
export type EventType = "Running" | "Marathon" | "Half Marathon" | "10K" | "5K" | "Triathlon" | "Ultra Marathon";

// Registration status
export type RegistrationStatus = "Pending" | "Paid" | "Confirmed" | "CheckedIn" | "Finished" | "Cancelled";

// Event status
export type EventStatus = "Draft" | "Published" | "Closed";

// Permission types
export type Permission =
    | "CREATE_EVENT"
    | "EDIT_EVENT"
    | "DELETE_EVENT"
    | "VIEW_REGISTRATIONS"
    | "MANAGE_REGISTRATIONS"
    | "IMPORT_RESULTS"
    | "VIEW_ATHLETE_DATA"
    | "MANAGE_CLUB";

// User entity
export interface User {
    id: string;
    role: UserRole;
    name: string;
    email: string;
    avatar?: string;
    clubId?: string;
    coachId?: string;
    createdAt: Date;
}

// Club entity
export interface Club {
    id: string;
    name: string;
    logo?: string;
    members: string[]; // User IDs
    createdAt: Date;
}

// Distance option for events
export interface DistanceOption {
    id: string;
    distance: string; // e.g., "42.2km", "21.1km"
    capacity: number;
    price: number;
}

// Price tier
export interface PriceTier {
    id: string;
    name: string; // e.g., "Early Bird", "Standard", "Late"
    price: number;
    validUntil: Date;
}

// Event entity
export interface Event {
    id: string;
    organiserId: string;
    title: string;
    type: EventType;
    date: Date;
    city: string;
    country: string;
    timezone: string;
    distanceOptions: DistanceOption[];
    capacity: number;
    priceTiers: PriceTier[];
    heroImage?: string;
    status: EventStatus;
    description?: string;
    createdAt: Date;
}

// Emergency contact
export interface EmergencyContact {
    name: string;
    phone: string;
    relationship: string;
}

// Registration entity
export interface Registration {
    id: string;
    eventId: string;
    athleteId: string;
    status: RegistrationStatus;
    bibNumber?: string;
    logisticsId?: string;
    wave?: string;
    tshirtSize?: string;
    emergencyContact?: EmergencyContact;
    distanceId: string; // Reference to DistanceOption
    registeredAt: Date;
}

// Split time
export interface Split {
    distance: string; // e.g., "5km", "10km"
    time: number; // in seconds
}

// Result entity
export interface Result {
    id: string;
    eventId: string;
    athleteId: string;
    gunTime: number; // in seconds
    chipTime: number; // in seconds
    splits: Split[];
    rankOverall: number;
    rankGender: number;
    rankAgeGroup: number;
    pbFlag: boolean; // Personal best
    createdAt: Date;
}

// Consent entity
export interface Consent {
    athleteId: string;
    allowCoachView: boolean;
    allowClubView: boolean;
    updatedAt: Date;
}

// Notification entity
export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    read: boolean;
    createdAt: Date;
}

// Incident entity (for timing issues)
export interface Incident {
    id: string;
    eventId: string;
    type: "duplicate_bib" | "missing_split" | "timing_error" | "other";
    description: string;
    athleteId?: string;
    bibNumber?: string;
    status: "open" | "resolved";
    createdAt: Date;
    resolvedAt?: Date;
}

// Auth session
export interface Session {
    user: User | null;
    isAuthenticated: boolean;
}
