/**
 * Utility helpers for checking user permissions and roles.
 *
 * This module provides reusable functions to evaluate whether
 * a user has specific permissions or roles within the application.
 * These helpers are typically used on the client side or in UI
 * components to control access to features and actions.
 *
 * The functions include:
 *
 * - hasPermission:
 *   Checks if the user has a specific permission.
 *
 * - hasAnyPermission:
 *   Checks if the user has at least one permission from a list
 *   of required permissions.
 *
 * - hasAllPermissions:
 *   Checks if the user has all permissions from a required set.
 *
 * - hasRole:
 *   Checks if the user has a specific role.
 *
 * - hasAnyRole:
 *   Checks if the user has at least one role from a list
 *   of required roles.
 *
 * All functions safely handle undefined or empty arrays and
 * return false when the required authorization data is missing.
 *
 * These helpers simplify permission and role validation across
 * the application's UI and business logic.
 */

export function hasPermission(
    permissions: string[] | undefined,
    permission: string
  ) {
    if (!permissions || permissions.length === 0) return false
    return permissions.includes(permission)
  }
  
  export function hasAnyPermission(
    permissions: string[] | undefined,
    requiredPermissions: string[]
  ) {
    if (!permissions || permissions.length === 0) return false
    return requiredPermissions.some((permission) =>
      permissions.includes(permission)
    )
  }
  
  export function hasAllPermissions(
    permissions: string[] | undefined,
    requiredPermissions: string[]
  ) {
    if (!permissions || permissions.length === 0) return false
    return requiredPermissions.every((permission) =>
      permissions.includes(permission)
    )
  }
  
  export function hasRole(roles: string[] | undefined, role: string) {
    if (!roles || roles.length === 0) return false
    return roles.includes(role)
  }
  
  export function hasAnyRole(roles: string[] | undefined, requiredRoles: string[]) {
    if (!roles || roles.length === 0) return false
    return requiredRoles.some((role) => roles.includes(role))
  }