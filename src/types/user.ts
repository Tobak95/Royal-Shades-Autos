export type UserRole = "customer" | "admin";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  isVerified: boolean;
  avatar?: string;
  /** ISO timestamp */
  createdAt: string;
}
