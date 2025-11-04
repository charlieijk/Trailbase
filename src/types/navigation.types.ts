/**
 * Defines the properties for a route in the application.
 */
export interface AppRouteDefinition {
  id: string;
  path: string;
  label: string;
  icon?: string;
  includeInNav?: boolean;
}

/**
 * Narrowed type for navigation entries derived from `AppRouteDefinition`.
 */
export interface NavigationItem {
  id: string;
  path: string;
  label: string;
  icon?: string;
}
