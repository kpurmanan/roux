"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";

export default function AppPage() {
    const { session } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (session.user) {
            // Redirect to role-specific dashboard
            if (session.user.role === "athlete") {
                router.push("/app/athlete/events");
            } else if (session.user.role === "organiser") {
                router.push("/app/organiser/dashboard");
            } else if (session.user.role === "coach") {
                router.push("/app/coach/dashboard");
            }
        }
    }, [session.user, router]);

    return null;
}
