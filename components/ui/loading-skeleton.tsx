"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "text" | "circular" | "rectangular" | "card";
}

export function LoadingSkeleton({ className, variant = "rectangular", ...props }: LoadingSkeletonProps) {
    const baseClasses = "animate-pulse bg-gradient-to-r from-muted/50 via-muted/80 to-muted/50 bg-[length:200%_100%]";

    const variantClasses = {
        text: "h-4 w-full rounded",
        circular: "h-12 w-12 rounded-full",
        rectangular: "h-32 w-full rounded-lg",
        card: "h-64 w-full rounded-2xl",
    };

    return (
        <div
            className={cn(baseClasses, variantClasses[variant], className)}
            style={{
                animation: "shimmer 2s linear infinite",
            }}
            {...props}
        />
    );
}

export function EventCardSkeleton() {
    return (
        <div className="glass rounded-2xl p-6 space-y-4">
            <LoadingSkeleton variant="rectangular" className="h-48" />
            <LoadingSkeleton variant="text" className="h-6 w-3/4" />
            <LoadingSkeleton variant="text" className="h-4 w-1/2" />
            <div className="flex gap-2">
                <LoadingSkeleton variant="text" className="h-8 w-20" />
                <LoadingSkeleton variant="text" className="h-8 w-20" />
            </div>
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4">
                    <LoadingSkeleton variant="text" className="h-12 flex-1" />
                    <LoadingSkeleton variant="text" className="h-12 w-32" />
                    <LoadingSkeleton variant="text" className="h-12 w-24" />
                </div>
            ))}
        </div>
    );
}
