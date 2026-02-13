"use client";

import React from "react";
import { Permission } from "@/lib/types";
import { useAuth } from "@/lib/auth/context";
import { canAccess } from "@/lib/auth/rbac";

interface PermissionGateProps {
    permission: Permission;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
    const { session } = useAuth();

    if (!session.user) {
        return <>{fallback}</>;
    }

    const hasPermission = canAccess(session.user.role, permission);

    if (!hasPermission) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
