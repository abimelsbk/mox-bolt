export type UserRole = 'mentor' | 'candidate' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isApproved: boolean;
  skills: string[];
  domains: string[];
}

export interface MentorshipService {
  id: string;
  mentorId: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  skills: string[];
  domains: string[];
}