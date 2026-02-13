import {
    User,
    Club,
    Event,
    Registration,
    Result,
    Notification,
    Incident,
    EventStatus,
    RegistrationStatus,
} from "../types";
import { Consent } from "./../types/performance";
import {
    users as seedUsers,
    clubs as seedClubs,
    events as seedEvents,
    registrations as seedRegistrations,
    results as seedResults,
    consents as seedConsents,
    notifications as seedNotifications,
    incidents as seedIncidents,
} from "./seed";

// In-memory data store
class DataStore {
    private users: User[] = [...seedUsers];
    private clubs: Club[] = [...seedClubs];
    private events: Event[] = [...seedEvents];
    private registrations: Registration[] = [...seedRegistrations];
    private results: Result[] = [...seedResults];
    private consents: Consent[] = [...seedConsents];
    private notifications: Notification[] = [...seedNotifications];
    private incidents: Incident[] = [...seedIncidents];

    // User operations
    getUsers() {
        return this.users;
    }

    getUserById(id: string) {
        return this.users.find((u) => u.id === id);
    }

    getUserByEmail(email: string) {
        return this.users.find((u) => u.email === email);
    }

    createUser(user: User) {
        this.users.push(user);
        return user;
    }

    updateUser(id: string, updates: Partial<User>) {
        const index = this.users.findIndex((u) => u.id === id);
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...updates };
            return this.users[index];
        }
        return null;
    }

    // Club operations
    getClubs() {
        return this.clubs;
    }

    getClubById(id: string) {
        return this.clubs.find((c) => c.id === id);
    }

    createClub(club: Club) {
        this.clubs.push(club);
        return club;
    }

    // Event operations
    getEvents(filters?: {
        country?: string;
        city?: string;
        type?: string;
        status?: EventStatus;
        dateFrom?: Date;
        dateTo?: Date;
    }) {
        let filtered = this.events;

        if (filters) {
            if (filters.country) {
                filtered = filtered.filter((e) => e.country === filters.country);
            }
            if (filters.city) {
                filtered = filtered.filter((e) => e.city === filters.city);
            }
            if (filters.type) {
                filtered = filtered.filter((e) => e.type === filters.type);
            }
            if (filters.status) {
                filtered = filtered.filter((e) => e.status === filters.status);
            }
            if (filters.dateFrom) {
                filtered = filtered.filter((e) => e.date >= filters.dateFrom!);
            }
            if (filters.dateTo) {
                filtered = filtered.filter((e) => e.date <= filters.dateTo!);
            }
        }

        return filtered;
    }

    getEventById(id: string) {
        return this.events.find((e) => e.id === id);
    }

    getEventsByOrganiser(organiserId: string) {
        return this.events.filter((e) => e.organiserId === organiserId);
    }

    createEvent(event: Event) {
        this.events.push(event);
        return event;
    }

    updateEvent(id: string, updates: Partial<Event>) {
        const index = this.events.findIndex((e) => e.id === id);
        if (index !== -1) {
            this.events[index] = { ...this.events[index], ...updates };
            return this.events[index];
        }
        return null;
    }

    // Registration operations
    getRegistrations(filters?: {
        eventId?: string;
        athleteId?: string;
        status?: RegistrationStatus;
    }) {
        let filtered = this.registrations;

        if (filters) {
            if (filters.eventId) {
                filtered = filtered.filter((r) => r.eventId === filters.eventId);
            }
            if (filters.athleteId) {
                filtered = filtered.filter((r) => r.athleteId === filters.athleteId);
            }
            if (filters.status) {
                filtered = filtered.filter((r) => r.status === filters.status);
            }
        }

        return filtered;
    }

    getRegistrationById(id: string) {
        return this.registrations.find((r) => r.id === id);
    }

    createRegistration(registration: Registration) {
        this.registrations.push(registration);
        return registration;
    }

    updateRegistration(id: string, updates: Partial<Registration>) {
        const index = this.registrations.findIndex((r) => r.id === id);
        if (index !== -1) {
            this.registrations[index] = { ...this.registrations[index], ...updates };
            return this.registrations[index];
        }
        return null;
    }

    // Result operations
    getResults(filters?: { eventId?: string; athleteId?: string }) {
        let filtered = this.results;

        if (filters) {
            if (filters.eventId) {
                filtered = filtered.filter((r) => r.eventId === filters.eventId);
            }
            if (filters.athleteId) {
                filtered = filtered.filter((r) => r.athleteId === filters.athleteId);
            }
        }

        return filtered;
    }

    createResult(result: Result) {
        this.results.push(result);
        return result;
    }

    // Consent operations
    getConsent(athleteId: string) {
        return this.consents.find((c) => c.athleteId === athleteId);
    }

    updateConsent(athleteId: string, updates: Partial<Consent>) {
        const index = this.consents.findIndex((c) => c.athleteId === athleteId);
        if (index !== -1) {
            this.consents[index] = { ...this.consents[index], ...updates };
            return this.consents[index];
        } else {
            const newConsent: Consent = {
                athleteId,
                allowCoachView: false,
                allowClubView: false,
                lastUpdated: new Date().toISOString(),
                ...updates,
            };
            this.consents.push(newConsent);
            return newConsent;
        }
    }

    // Notification operations
    getNotifications(userId: string) {
        return this.notifications.filter((n) => n.userId === userId);
    }

    createNotification(notification: Notification) {
        this.notifications.push(notification);
        return notification;
    }

    markNotificationAsRead(id: string) {
        const index = this.notifications.findIndex((n) => n.id === id);
        if (index !== -1) {
            this.notifications[index].read = true;
            return this.notifications[index];
        }
        return null;
    }

    // Incident operations
    getIncidents(eventId?: string) {
        if (eventId) {
            return this.incidents.filter((i) => i.eventId === eventId);
        }
        return this.incidents;
    }

    createIncident(incident: Incident) {
        this.incidents.push(incident);
        return incident;
    }

    updateIncident(id: string, updates: Partial<Incident>) {
        const index = this.incidents.findIndex((i) => i.id === id);
        if (index !== -1) {
            this.incidents[index] = { ...this.incidents[index], ...updates };
            return this.incidents[index];
        }
        return null;
    }
}

// Singleton instance
export const dataStore = new DataStore();
