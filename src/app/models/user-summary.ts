export interface UserSummary {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  userType: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}