import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Student } from '@/types/student';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap,
  Droplets,
  AlertCircle 
} from 'lucide-react';

interface StudentPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
}

export const StudentPreviewDialog: React.FC<StudentPreviewDialogProps> = ({
  open,
  onOpenChange,
  student,
}) => {
  if (!student) return null;

  const infoItems = [
    { icon: User, label: "Father's Name", value: student.father_name },
    { icon: GraduationCap, label: 'Department', value: student.department },
    { icon: GraduationCap, label: 'Program', value: student.program },
    { icon: Calendar, label: 'Session', value: student.session },
    { icon: Droplets, label: 'Blood Group', value: student.blood_group },
    { icon: Phone, label: 'Contact', value: student.contact },
    { icon: AlertCircle, label: 'Emergency Contact', value: student.emergency_contact },
    { icon: MapPin, label: 'Address', value: student.address },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with photo */}
          <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
            <div className="w-20 h-20 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shrink-0">
              {student.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-foreground truncate">{student.name}</h3>
              <Badge variant="secondary" className="mt-1 font-mono">
                {student.roll_no}
              </Badge>
            </div>
          </div>

          {/* Info Grid */}
          <div className="space-y-3">
            {infoItems.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Validity */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">Valid From</p>
              <p className="text-sm font-medium text-foreground">{student.valid_from}</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Valid Until</p>
              <p className="text-sm font-medium text-foreground">{student.valid_until}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
