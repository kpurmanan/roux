"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "../types";
import { dataStore } from "../data/store";
import { seedPerformanceData } from "../seed/performance-seed";

interface AuthContextType {
    session: Session;
    signIn: (email: string, password: string) => Promise<boolean>;
    signUp: (email: string, password: string, name: string, role: User["role"]) => Promise<boolean>;
    signOut: () => void;
    updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session>({
        user: null,
        isAuthenticated: false,
    });

    // Load session from localStorage on mount
    useEffect(() => {
        try {
            const storedUserId = localStorage.getItem("pacepass_user_id");
            if (storedUserId) {
                const user = dataStore.getUserById(storedUserId);
                if (user) {
                    setSession({ user, isAuthenticated: true });
                }
            }
        } catch (e) {
            console.error("Failed to load session from localStorage:", e);
        }
    }, []);

    // Seed performance data
    useEffect(() => {
        seedPerformanceData();
    }, []);

    const signIn = async (email: string, _password: string): Promise<boolean> => {
        // Mock authentication - in real app, this would call an API
        const user = dataStore.getUserByEmail(email);
        if (user) {
            setSession({ user, isAuthenticated: true });
            try {
                localStorage.setItem("pacepass_user_id", user.id);
            } catch (e) { }
            return true;
        }
        return false;
    };

    const signUp = async (
        email: string,
        password: string,
        name: string,
        role: User["role"]
    ): Promise<boolean> => {
        // Mock sign up - in real app, this would call an API
        const existingUser = dataStore.getUserByEmail(email);
        if (existingUser) {
            return false; // User already exists
        }

        const newUser: User = {
            id: `user-${Date.now()}`,
            email,
            name,
            role,
            createdAt: new Date(),
        };

        dataStore.createUser(newUser);
        setSession({ user: newUser, isAuthenticated: true });
        try {
            localStorage.setItem("pacepass_user_id", newUser.id);
        } catch (e) { }
        return true;
    };

    const signOut = () => {
        setSession({ user: null, isAuthenticated: false });
        try {
            localStorage.removeItem("pacepass_user_id");
        } catch (e) { }
    };

    const updateUser = (updates: Partial<User>) => {
        if (session.user) {
            const updated = dataStore.updateUser(session.user.id, updates);
            if (updated) {
                setSession({ ...session, user: updated });
            }
        }
    };

    return (
        <AuthContext.Provider value={{ session, signIn, signUp, signOut, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    // During SSR/Prerender, we might not have the context if it's high up the tree
    // especially if being probed by Next.js build workers.
    // Instead of throwing, we return a default session if we're on the server.
    if (context === undefined) {
        if (typeof window === "undefined") {
            return {
                session: { user: null, isAuthenticated: false },
                signIn: async () => false,
                signUp: async () => false,
                signOut: () => { },
                updateUser: () => { },
            };
        }
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
