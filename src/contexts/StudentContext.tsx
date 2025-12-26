import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Student, StudentFormData } from '@/types/student';

// Demo data
const DEMO_STUDENTS: Student[] = [
  {
    id: '1',
    roll_no: 'UOS-2024-CS-001',
    name: 'Ahmed Hassan',
    father_name: 'Muhammad Hassan',
    department: 'Computer Science',
    program: 'BS Computer Science',
    session: '2024-2028',
    blood_group: 'A+',
    contact: '03001234567',
    emergency_contact: '03009876543',
    address: '123 University Road, Sargodha',
    valid_from: '2024-09-01',
    valid_until: '2028-08-31',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    roll_no: 'UOS-2024-CS-002',
    name: 'Fatima Ali',
    father_name: 'Muhammad Ali',
    department: 'Computer Science',
    program: 'BS Computer Science',
    session: '2024-2028',
    blood_group: 'B+',
    contact: '03021234567',
    emergency_contact: '03029876543',
    address: '456 College Street, Sargodha',
    valid_from: '2024-09-01',
    valid_until: '2028-08-31',
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
  },
  {
    id: '3',
    roll_no: 'UOS-2023-EE-015',
    name: 'Usman Khan',
    father_name: 'Imran Khan',
    department: 'Electrical Engineering',
    program: 'BS Electrical Engineering',
    session: '2023-2027',
    blood_group: 'O+',
    contact: '03031234567',
    emergency_contact: '03039876543',
    address: '789 Main Boulevard, Sargodha',
    valid_from: '2023-09-01',
    valid_until: '2027-08-31',
    created_at: '2024-01-17T10:00:00Z',
    updated_at: '2024-01-17T10:00:00Z',
  },
  {
    id: '4',
    roll_no: 'UOS-2024-BBA-003',
    name: 'Ayesha Malik',
    father_name: 'Tariq Malik',
    department: 'Business Administration',
    program: 'BBA',
    session: '2024-2028',
    blood_group: 'AB+',
    contact: '03041234567',
    emergency_contact: '03049876543',
    address: '321 Garden Town, Sargodha',
    valid_from: '2024-09-01',
    valid_until: '2028-08-31',
    created_at: '2024-01-18T10:00:00Z',
    updated_at: '2024-01-18T10:00:00Z',
  },
];

interface StudentContextType {
  students: Student[];
  selectedStudents: string[];
  isLoading: boolean;
  addStudent: (data: StudentFormData) => Promise<Student>;
  updateStudent: (id: string, data: StudentFormData) => Promise<Student>;
  deleteStudent: (id: string) => Promise<void>;
  toggleSelectStudent: (id: string) => void;
  selectAllStudents: () => void;
  clearSelection: () => void;
  getStudentById: (id: string) => Student | undefined;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(DEMO_STUDENTS);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addStudent = useCallback(async (data: StudentFormData): Promise<Student> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newStudent: Student = {
      ...data,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setStudents(prev => [...prev, newStudent]);
    setIsLoading(false);
    return newStudent;
  }, []);

  const updateStudent = useCallback(async (id: string, data: StudentFormData): Promise<Student> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedStudent: Student = {
      ...data,
      id,
      created_at: students.find(s => s.id === id)?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setStudents(prev => prev.map(s => s.id === id ? updatedStudent : s));
    setIsLoading(false);
    return updatedStudent;
  }, [students]);

  const deleteStudent = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setStudents(prev => prev.filter(s => s.id !== id));
    setSelectedStudents(prev => prev.filter(sId => sId !== id));
    setIsLoading(false);
  }, []);

  const toggleSelectStudent = useCallback((id: string) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  }, []);

  const selectAllStudents = useCallback(() => {
    setSelectedStudents(students.map(s => s.id));
  }, [students]);

  const clearSelection = useCallback(() => {
    setSelectedStudents([]);
  }, []);

  const getStudentById = useCallback((id: string) => {
    return students.find(s => s.id === id);
  }, [students]);

  return (
    <StudentContext.Provider value={{
      students,
      selectedStudents,
      isLoading,
      addStudent,
      updateStudent,
      deleteStudent,
      toggleSelectStudent,
      selectAllStudents,
      clearSelection,
      getStudentById,
    }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
};
