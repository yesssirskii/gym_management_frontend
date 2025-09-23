import { GenderEnum } from "./enums/gender-enum";
import { TrainerSpecializationEnum } from "./enums/trainer-specialization-enum";
import { UserSummary } from "./user-summary";

export interface UserDetailDto extends UserSummary {
  dateOfBirth: string;
  gender?: GenderEnum;
  address?: string;
  profileImageUrl?: string;
  
  // Member
  membershipNumber?: string;
  joinDate?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  hasActiveSubscription?: boolean;
  
  // Trainer
  specialization?: TrainerSpecializationEnum;
  yearsOfExperience?: number;
  hourlyRate?: number;
  rating?: number;
  
  // Personnel
  role?: string;
  employeeId?: string;
  hireDate?: string;
}