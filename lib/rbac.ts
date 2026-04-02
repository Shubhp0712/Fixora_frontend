export type AppRole = 'employee' | 'it_support' | 'manager' | 'admin';

export type Permission =
    | 'ticket:create'
    | 'ticket:comment'
    | 'ticket:update_status'
    | 'ticket:update_priority'
    | 'ticket:assign'
    | 'admin:access';

const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
    employee: ['ticket:create', 'ticket:comment'],
    it_support: [
        'ticket:create',
        'ticket:comment',
        'ticket:update_status',
        'ticket:update_priority',
        'ticket:assign',
    ],
    manager: [
        'ticket:create',
        'ticket:comment',
        'ticket:update_status',
        'ticket:update_priority',
        'ticket:assign',
        'admin:access',
    ],
    admin: [
        'ticket:create',
        'ticket:comment',
        'ticket:update_status',
        'ticket:update_priority',
        'ticket:assign',
        'admin:access',
    ],
};

export function hasPermission(role: AppRole, permission: Permission): boolean {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getRoleLabel(role: AppRole): string {
    if (role === 'it_support') {
        return 'IT Support';
    }
    return role.charAt(0).toUpperCase() + role.slice(1);
}
