import { Permission, UserRole } from "../types";

// Permission definitions
export const PERMISSIONS = {
    CREATE_EVENT: "CREATE_EVENT" as Permission,
    EDIT_EVENT: "EDIT_EVENT" as Permission,
    DELETE_EVENT: "DELETE_EVENT" as Permission,
    VIEW_REGISTRATIONS: "VIEW_REGISTRATIONS" as Permission,
    MANAGE_REGISTRATIONS: "MANAGE_REGISTRATIONS" as Permission,
    IMPORT_RESULTS: "IMPORT_RESULTS" as Permission,
    VIEW_ATHLETE_DATA: "VIEW_ATHLETE_DATA" as Permission,
    MANAGE_CLUB: "MANAGE_CLUB" as Permission,
};

// Role to permissions mapping
const rolePermissions: Record<UserRole, Permission[]> = {
    organiser: [
        PERMISSIONS.CREATE_EVENT,
        PERMISSIONS.EDIT_EVENT,
        PERMISSIONS.DELETE_EVENT,
        PERMISSIONS.VIEW_REGISTRATIONS,
        PERMISSIONS.MANAGE_REGISTRATIONS,
        PERMISSIONS.IMPORT_RESULTS,
    ],
    athlete: [],
    coach: [PERMISSIONS.VIEW_ATHLETE_DATA, PERMISSIONS.MANAGE_CLUB],
};

/**
 * Check if a role has a specific permission
 */
export function canAccess(role: UserRole, permission: Permission): boolean {
    return rolePermissions[role]?.includes(permission) ?? false;
}

/**
 * Get all permissions for a role
 */
export function getPermissions(role: UserRole): Permission[] {
    return rolePermissions[role] ?? [];
}
