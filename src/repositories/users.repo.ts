/**
 * User data access helpers.
 *
 * This module centralizes all database operations related to users.
 * It uses Prisma to query and modify records in the users table and
 * supports both OAuth and credentials-based authentication flows.
 *
 * The functions include:
 *
 * - findUserByEmail:
 *   Retrieves a user by their email address.
 *
 * - findUserById:
 *   Retrieves a user by their unique user_id.
 *
 * - createOAuthUser:
 *   Creates a new user record when the user signs in through
 *   an OAuth provider (Google or GitHub).
 *
 * - updateUserName:
 *   Updates the name of an existing user.
 *
 * - updateUserEmail:
 *   Updates the email address of an existing user.
 *
 * - findCredentialsUserByEmail:
 *   Retrieves user data required for credentials authentication,
 *   including the password hash.
 *
 * - createCredentialsUser:
 *   Creates a new user with an email and password hash for
 *   credentials-based authentication.
 *
 * - updateUserPasswordHash:
 *   Updates the stored password hash when the user changes their password.
 *
 * - getProfileByUserId:
 *   Retrieves profile information for a user, including authentication
 *   data required for password updates.
 *
 * - deleteUserById:
 *   Permanently removes a user from the database.
 *
 * These helpers act as the user repository layer and are used by
 * authentication services, profile management, and account security
 * features throughout the application.
 */

import { prisma } from "@/lib/prisma"

export async function findUserByEmail(email: string) {
  return prisma.users.findUnique({
    where: { email },
  })
}

export async function findUserById(userId: bigint) {
  return prisma.users.findUnique({
    where: { user_id: userId },
  })
}

export async function createOAuthUser(params: {
  email: string
  name?: string | null
}) {
  return prisma.users.create({
    data: {
      email: params.email,
      name: params.name ?? null,
      status: "active",
    },
  })
}

export async function updateUserName(params: {
  userId: bigint
  name: string
}) {
  return prisma.users.update({
    where: { user_id: params.userId },
    data: { name: params.name },
  })
}

export async function updateUserEmail(params: {
  userId: bigint
  email: string
}) {
  return prisma.users.update({
    where: { user_id: params.userId },
    data: { email: params.email },
  })
}

export async function findCredentialsUserByEmail(email: string) {
  return prisma.users.findUnique({
    where: { email },
    select: {
      user_id: true,
      email: true,
      name: true,
      password_hash: true,
      status: true,
    },
  })
}

export async function createCredentialsUser(params: {
  name: string
  email: string
  passwordHash: string
}) {
  return prisma.users.create({
    data: {
      name: params.name,
      email: params.email,
      password_hash: params.passwordHash,
      status: "active",
    },
    select: {
      user_id: true,
      name: true,
      email: true,
      status: true,
    },
  })
}

export async function updateUserPasswordHash(params: {
  userId: bigint
  passwordHash: string
}) {
  return prisma.users.update({
    where: { user_id: params.userId },
    data: {
      password_hash: params.passwordHash,
    },
    select: {
      user_id: true,
      email: true,
      name: true,
      status: true,
    },
  })
}

export async function getProfileByUserId(userId: bigint) {
  return prisma.users.findUnique({
    where: { user_id: userId },
    select: {
      user_id: true,
      name: true,
      email: true,
      status: true,
      password_hash: true,
    },
  })
}

export async function deleteUserById(userId: bigint) {
  return prisma.users.delete({
    where: { user_id: userId },
  })
}