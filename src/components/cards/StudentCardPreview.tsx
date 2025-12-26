import React from 'react';
import type { Student } from '@/types/student';
import { QrCode, GraduationCap, Phone, Droplets, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentCardPreviewProps {
  student: Student;
  showBack?: boolean;
}

export const StudentCardPreview: React.FC<StudentCardPreviewProps> = ({
  student,
  showBack = false,
}) => {
  // ISO/IEC 7810 ID-1 card dimensions: 85.6mm × 53.98mm (3.375" × 2.125")
  // We'll scale to preview at ~340px × 214px (roughly 4x for visibility)
  
  return (
    <div 
      className={cn(
        "relative w-[340px] h-[214px] rounded-xl overflow-hidden shadow-xl transition-transform duration-500",
        showBack && "rotate-y-180"
      )}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Front of card */}
      <div 
        className={cn(
          "absolute inset-0 backface-hidden",
          showBack && "invisible"
        )}
      >
        <div className="w-full h-full gradient-hero p-4 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary-foreground leading-tight">
                University of Sahiwal
              </h3>
              <p className="text-[10px] text-primary-foreground/70">Student Identity Card</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex gap-3 flex-1">
            {/* Photo */}
            <div className="w-20 h-24 rounded-lg bg-primary-foreground/20 flex items-center justify-center overflow-hidden shrink-0">
              {student.photo_url ? (
                <img 
                  src={student.photo_url} 
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-primary-foreground">
                  {student.name.charAt(0)}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-primary-foreground space-y-1.5">
              <div>
                <p className="text-xs text-primary-foreground/60">Name</p>
                <p className="text-sm font-semibold truncate">{student.name}</p>
              </div>
              <div>
                <p className="text-xs text-primary-foreground/60">Roll No</p>
                <p className="text-xs font-mono">{student.roll_no}</p>
              </div>
              <div>
                <p className="text-xs text-primary-foreground/60">Program</p>
                <p className="text-xs truncate">{student.program}</p>
              </div>
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-primary-foreground/60" />
                <span className="text-xs font-semibold">{student.blood_group}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-2 pt-2 border-t border-primary-foreground/20 flex items-center justify-between">
            <div>
              <p className="text-[8px] text-primary-foreground/60">Valid: {student.valid_from} - {student.valid_until}</p>
            </div>
            <div className="w-10 h-10 bg-primary-foreground rounded p-1">
              <QrCode className="w-full h-full text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Back of card */}
      <div 
        className={cn(
          "absolute inset-0 backface-hidden",
          !showBack && "invisible"
        )}
        style={{ transform: 'rotateY(180deg)' }}
      >
        <div className="w-full h-full bg-card p-4 flex flex-col">
          {/* Header */}
          <div className="text-center mb-3">
            <h3 className="text-sm font-bold text-foreground">STUDENT ID CARD</h3>
            <p className="text-[10px] text-muted-foreground">University of Sahiwal</p>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-muted-foreground w-20 shrink-0">Father:</span>
              <span className="text-foreground">{student.father_name}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-muted-foreground w-20 shrink-0">Department:</span>
              <span className="text-foreground">{student.department}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-muted-foreground w-20 shrink-0">Session:</span>
              <span className="text-foreground">{student.session}</span>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
              <span className="text-foreground">{student.contact}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
              <span className="text-foreground text-[10px] line-clamp-2">{student.address}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-2 pt-2 border-t border-border">
            <div className="h-8 bg-foreground/5 rounded flex items-center justify-center">
              <div className="flex gap-0.5">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-0.5 bg-foreground/70"
                    style={{ height: `${8 + Math.random() * 16}px` }}
                  />
                ))}
              </div>
            </div>
            <p className="text-center text-[8px] text-muted-foreground mt-1">
              Emergency: {student.emergency_contact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
