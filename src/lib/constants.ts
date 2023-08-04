export const UserTypes = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    WORKER: 'Worker'
} as const;

export const TaskTypes = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
} as const;

export const TaskStatuses = {
    WAITING: 'Waiting',
    ACTIVE: 'Active',
    COMPLETED: 'Completed',
    REPORTED: 'Reported'
} as const;

export const PlanTypes = {
    FREE: 'Free',
    MONTHLY: 'Monthly',
    YEARLY: 'Yearly',
} as const;