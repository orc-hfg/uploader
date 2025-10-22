export const ROUTE_BASE_NAME_ORDER = ['index', 'projects', 'project-id'] as const;

export type RouteBaseName = typeof ROUTE_BASE_NAME_ORDER[number];
