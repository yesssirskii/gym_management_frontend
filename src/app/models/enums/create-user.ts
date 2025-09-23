import { GenderEnum } from "./gender-enum";
import { PersonnelRoleEnum } from "./personnel-role-enum";
import { TrainerSpecializationEnum } from "./trainer-specialization-enum";

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth: string;
  gender?: GenderEnum;
  address?: string;
  userType: string;
  
  // Member
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalNotes?: string;
  fitnessGoals?: string;
  height?: number;
  weight?: number;
  
  // Trainer
  specialization?: TrainerSpecializationEnum;
  certifications?: string;
  yearsOfExperience?: number;
  hourlyRate?: number;
  bio?: string;
  
  // Personnel
  role?: PersonnelRoleEnum;
  salary?: number;
  employeeId?: string;
  jobDescription?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  gender?: GenderEnum;
  address?: string;
  profileImageUrl?: string;
}