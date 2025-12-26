import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  GraduationCap, 
  CheckCircle2, 
  XCircle,
  User,
  Calendar,
  BookOpen,
  Building2,
  ArrowLeft
} from 'lucide-react';
import { useStudents } from '@/contexts/StudentContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Verify: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const { getStudentById } = useStudents();
  
  const student = studentId ? getStudentById(studentId) : null;
  const isValid = student && new Date(student.valid_until) >= new Date();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero text-primary-foreground py-6">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold">University of Sahiwal</h1>
              <p className="text-sm text-primary-foreground/70">Student ID Verification</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-2xl mx-auto px-4 py-8">
        {student ? (
          <div className="space-y-6 animate-fade-in">
            {/* Status Banner */}
            <div className={cn(
              "p-4 rounded-xl flex items-center gap-4",
              isValid ? "bg-success/10" : "bg-destructive/10"
            )}>
              {isValid ? (
                <>
                  <CheckCircle2 className="w-10 h-10 text-success shrink-0" />
                  <div>
                    <h2 className="font-bold text-success text-lg">Verified Student</h2>
                    <p className="text-sm text-success/80">This is a valid student ID card</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-10 h-10 text-destructive shrink-0" />
                  <div>
                    <h2 className="font-bold text-destructive text-lg">Card Expired</h2>
                    <p className="text-sm text-destructive/80">This student ID card has expired</p>
                  </div>
                </>
              )}
            </div>

            {/* Student Info Card */}
            <div className="card-elevated p-6 space-y-6">
              {/* Photo & Name */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shrink-0">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{student.name}</h3>
                  <p className="text-muted-foreground font-mono">{student.roll_no}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <Building2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Department</p>
                    <p className="text-sm font-medium text-foreground">{student.department}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <BookOpen className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Program</p>
                    <p className="text-sm font-medium text-foreground">{student.program}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <User className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Father's Name</p>
                    <p className="text-sm font-medium text-foreground">{student.father_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <Calendar className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Session</p>
                    <p className="text-sm font-medium text-foreground">{student.session}</p>
                  </div>
                </div>
              </div>

              {/* Validity */}
              <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
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

            {/* Footer Note */}
            <p className="text-xs text-center text-muted-foreground">
              This verification page shows non-sensitive public information only.
              For any concerns, please contact the university administration.
            </p>
          </div>
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <XCircle className="w-16 h-16 text-destructive/50 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Student Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The student ID you're looking for doesn't exist or may have been removed.
            </p>
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4" />
                Go to Home
              </Button>
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-auto">
        <div className="container max-w-2xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} University of Sahiwal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Verify;
