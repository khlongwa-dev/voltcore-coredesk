export const canAssignTickets = (user) => ['agent', 'admin'].includes(user?.role);
export const canEditTicketDetails = (user) => ['agent', 'admin'].includes(user?.role);
export const canViewInternalNotes = (user) => ['agent', 'admin'].includes(user?.role);
export const canManageUsers = (user) => user?.role === 'admin';