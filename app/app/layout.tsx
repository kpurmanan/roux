"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { Home, Calendar, Activity, User, Trophy, Users, BarChart3 } from "lucide-react";
import { DynamicIslandHeader } from "@/components/ui/dynamic-island-header";
import { IOSBottomTabs } from "@/components/ui/ios-bottom-tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { session } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!session.isAuthenticated) {
            router.push("/auth/sign-in");
        }
    }, [session.isAuthenticated, router]);

    if (!session.isAuthenticated || !session.user) {
        return null;
    }

    const athleteTabs = [
        { href: "/app/athlete/events", label: "Events", icon: Calendar },
        { href: "/app/athlete/performance", label: "Performance", icon: Activity },
        { href: "/app/athlete/profile", label: "Profile", icon: User },
    ];

    const organiserTabs = [
        { href: "/app/organiser/dashboard", label: "Dashboard", icon: Home },
        { href: "/app/organiser/events", label: "Events", icon: Trophy },
    ];

    const coachTabs = [
        { href: "/app/coach/dashboard", label: "Dashboard", icon: Home },
        { href: "/app/coach/athletes", label: "Athletes", icon: Users },
    ];

    const tabs = session.user.role === "athlete" ? athleteTabs : session.user.role === "organiser" ? organiserTabs : coachTabs;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
            {/* Mobile Header */}
            <DynamicIslandHeader />

            {/* Desktop Sidebar */}
            <aside className="hidden md:block fixed left-0 top-0 h-full w-64 glass-subtle border-r border-border/50 p-4">
                <Link href="/" className="flex items-center gap-2 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold gradient-text">PacePass</span>
                </Link>

                <nav className="space-y-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
                            >
                                <Icon className="h-5 w-5" />
                                <span className="font-medium">{tab.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-4 left-4 right-4">
                    <ThemeToggle className="w-full" />
                </div>
            </aside>

            {/* Main Content */}
            <main className="md:ml-64 min-h-screen pb-20 md:pb-4">
                <div className="container mx-auto px-4 py-6">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Tabs */}
            <IOSBottomTabs tabs={tabs} />
        </div>
    );
}
