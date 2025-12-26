export interface Student {
  id: string;
  roll_no: string;
  name: string;
  father_name: string;
  department: string;
  program: string;
  session: string;
  blood_group: BloodGroup;
  contact: string;
  emergency_contact: string;
  address: string;
  photo_url?: string;
  valid_from: string;
  valid_until: string;
  created_at: string;
  updated_at: string;
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export interface StudentFormData {
  roll_no: string;
  name: string;
  father_name: string;
  department: string;
  program: string;
  session: string;
  blood_group: BloodGroup;
  contact: string;
  emergency_contact: string;
  address: string;
  photo_url?: string;
  valid_from: string;
  valid_until: string;
}

export interface Template {
  id: string;
  name: string;
  front_svg: string;
  back_svg: string;
  created_at: string;
}

export interface CardGenerationJob {
  id: string;
  student_ids: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  output_url?: string;
  created_at: string;
}
