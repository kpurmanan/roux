"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusChipVariants = cva(
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-200",
    {
        variants: {
            variant: {
                pending: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
                paid: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
                confirmed: "bg-green-500/20 text-green-300 border border-green-500/30",
                checkedIn: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
                finished: "bg-gray-500/20 text-gray-300 border border-gray-500/30",
                cancelled: "bg-red-500/20 text-red-300 border border-red-500/30",
                draft: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
                published: "bg-green-500/20 text-green-400 border border-green-500/30",
                closed: "bg-red-500/20 text-red-400 border border-red-500/30",
            },
        },
        defaultVariants: {
            variant: "pending",
        },
    }
);

export interface StatusChipProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusChipVariants> {
    children: React.ReactNode;
}

const StatusChip = React.forwardRef<HTMLSpanElement, StatusChipProps>(
    ({ className, variant, children, ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={cn(statusChipVariants({ variant }), className)}
                {...props}
            >
                {children}
            </span>
        );
    }
);
StatusChip.displayName = "StatusChip";

export { StatusChip, statusChipVariants };
