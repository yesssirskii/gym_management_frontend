export interface UserSummary {
  id: number;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  userType: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}