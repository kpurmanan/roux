import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassCardVariants = cva(
    "rounded-2xl transition-all duration-300",
    {
        variants: {
            variant: {
                default: "glass",
                elevated: "glass-elevated hover:scale-[1.02]",
                subtle: "glass-subtle",
                interactive: "glass cursor-pointer hover:scale-[1.01] hover:shadow-2xl active:scale-[0.99]",
            },
            padding: {
                none: "p-0",
                sm: "p-4",
                md: "p-6",
                lg: "p-8",
            },
        },
        defaultVariants: {
            variant: "default",
            padding: "md",
        },
    }
);

export interface GlassCardProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> { }

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, variant, padding, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(glassCardVariants({ variant, padding }), className)}
                {...props}
            />
        );
    }
);
GlassCard.displayName = "GlassCard";

export { GlassCard, glassCardVariants };
