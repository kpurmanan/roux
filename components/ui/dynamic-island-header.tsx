"use client";

import * as React from "react";
import { Bell, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/context";
import { StatusChip } from "./status-chip";
import { dataStore } from "@/lib/data/store";

export function DynamicIslandHeader() {
    const { session } = useAuth();
    const [unreadCount, setUnreadCount] = React.useState(0);

    React.useEffect(() => {
        if (session.user) {
            const notifications = dataStore.getNotifications(session.user.id);
            const unread = notifications.filter((n) => !n.read).length;
            setUnreadCount(unread);
        }
    }, [session.user]);

    if (!session.user) return null;

    const roleVariant = {
        organiser: "confirmed" as const,
        athlete: "paid" as const,
        coach: "checkedIn" as const,
    };

    return (
        <div className="md:hidden safe-area-top">
            <div className="flex items-center justify-between px-4 py-3 glass-subtle border-b border-border/50">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">{session.user.name}</p>
                        <StatusChip variant={roleVariant[session.user.role]} className="text-[10px] px-2 py-0.5">
                            {session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1)}
                        </StatusChip>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" title="Online" />
                </div>
            </div>
        </div>
    );
}
