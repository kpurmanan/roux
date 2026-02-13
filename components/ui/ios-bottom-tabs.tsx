"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TabItem {
    href: string;
    label: string;
    icon: LucideIcon;
}

interface IOSBottomTabsProps {
    tabs: TabItem[];
}

export function IOSBottomTabs({ tabs }: IOSBottomTabsProps) {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-area-bottom">
            <div className="glass-elevated border-t border-border/50 px-2 py-2">
                <div className="flex items-center justify-around">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
                        const Icon = tab.icon;

                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 relative",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary/10 rounded-xl"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <Icon className={cn("h-5 w-5 relative z-10", isActive && "scale-110")} />
                                <span className="text-xs font-medium relative z-10">{tab.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
