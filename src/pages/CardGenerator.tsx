import React, { useState } from 'react';
import { 
  CreditCard, 
  Download, 
  Printer, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Check
} from 'lucide-react';
import { useStudents } from '@/contexts/StudentContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { StudentCardPreview } from '@/components/cards/StudentCardPreview';
import { cn } from '@/lib/utils';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

const CardGenerator: React.FC = () => {
  const { students, selectedStudents, toggleSelectStudent, clearSelection, selectAllStudents } = useStudents();
  const [previewIndex, setPreviewIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  const studentsToGenerate = selectedStudents.length > 0 
    ? students.filter(s => selectedStudents.includes(s.id))
    : students;

  const currentStudent = studentsToGenerate[previewIndex];
  const isAllSelected = students.length > 0 && selectedStudents.length === students.length;

  const handleNext = () => {
    setPreviewIndex(i => Math.min(studentsToGenerate.length - 1, i + 1));
    setShowBack(false);
  };

  const handlePrev = () => {
    setPreviewIndex(i => Math.max(0, i - 1));
    setShowBack(false);
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAllStudents();
    }
    setPreviewIndex(0);
  };


  const handleDownloadPNG = async () => {
    if (!currentStudent) return;
    try {
      const element = document.getElementById('card-preview-container');
      if (!element) return;

      const dataUrl = await toPng(element, { quality: 0.95, pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `${currentStudent.roll_no}_card.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Card downloaded successfully');
    } catch (error) {
      console.error('Error downloading card:', error);
      toast.error('Failed to download card');
    }
  };

  const handleDownloadPDF = async () => {
    if (!currentStudent) return;
    try {
      const element = document.getElementById('card-preview-container');
      if (!element) return;

      const dataUrl = await toPng(element, { quality: 0.95, pixelRatio: 3 });
      
      // Landscape ID-1 card size: 85.6mm x 53.98mm
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98]
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, 85.6, 53.98);
      pdf.save(`${currentStudent.roll_no}_card.pdf`);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  const handleWhatsAppShare = () => {
    if (currentStudent) {
      const verifyUrl = `${window.location.origin}/verify/${currentStudent.id}`;
      const message = encodeURIComponent(
        `Student ID Card - ${currentStudent.name}\nRoll No: ${currentStudent.roll_no}\nVerify: ${verifyUrl}`
      );
      window.open(`https://wa.me/?text=${message}`, '_blank');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Card Generator</h1>
          <p className="text-muted-foreground mt-1">Preview and generate student ID cards</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="w-5 h-5" />
            <span className="hidden sm:inline">Print</span>
          </Button>
          <Button variant="hero" onClick={handleDownloadPDF}>
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline">Download PDF</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Selection */}
        <div className="lg:col-span-1 card-elevated p-4 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Select Students</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSelectAll}
              className="text-accent"
            >
              {isAllSelected ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
          
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {students.map((student) => (
              <label 
                key={student.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                  selectedStudents.includes(student.id) 
                    ? "bg-accent/10 border border-accent/20" 
                    : "bg-secondary hover:bg-secondary/80"
                )}
              >
                <Checkbox 
                  checked={selectedStudents.includes(student.id)}
                  onCheckedChange={() => toggleSelectStudent(student.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{student.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{student.roll_no}</p>
                </div>
                {selectedStudents.includes(student.id) && (
                  <Check className="w-4 h-4 text-accent shrink-0" />
                )}
              </label>
            ))}
          </div>

          {selectedStudents.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{selectedStudents.length}</span> student(s) selected for generation
              </p>
            </div>
          )}
        </div>

        {/* Card Preview */}
        <div className="lg:col-span-2 card-elevated p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-foreground">Card Preview</h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowBack(!showBack)}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                {showBack ? 'Front' : 'Back'}
              </Button>
            </div>
          </div>

          {currentStudent ? (
            <div className="space-y-6">
              {/* Card Display */}
              <div className="flex justify-center">
                <div className="perspective-1000" id="card-preview-container">
                  <StudentCardPreview 
                    student={currentStudent} 
                    showBack={showBack}
                  />
                </div>
              </div>

              {/* Navigation */}
              {studentsToGenerate.length > 1 && (
                <div className="flex items-center justify-center gap-4">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handlePrev}
                    disabled={previewIndex === 0}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {previewIndex + 1} of {studentsToGenerate.length}
                  </span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleNext}
                    disabled={previewIndex === studentsToGenerate.length - 1}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap justify-center gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={handleWhatsAppShare}>
                  <MessageCircle className="w-4 h-4" />
                  Share via WhatsApp
                </Button>
                <Button variant="outline" onClick={handleDownloadPNG}>
                  <Download className="w-4 h-4" />
                  Download PNG
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CreditCard className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Select students to preview their cards</p>
            </div>
          )}
        </div>
      </div>

      {/* Batch Generation Info */}
      <div className="card-elevated p-6">
        <h2 className="font-semibold text-foreground mb-4">Batch Generation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-secondary rounded-lg">
            <p className="text-2xl font-bold text-foreground">{selectedStudents.length || students.length}</p>
            <p className="text-sm text-muted-foreground">Cards to generate</p>
          </div>
          <div className="p-4 bg-secondary rounded-lg">
            <p className="text-2xl font-bold text-foreground">ISO/IEC 7810</p>
            <p className="text-sm text-muted-foreground">ID-1 Compliant (CR80)</p>
          </div>
          <div className="p-4 bg-secondary rounded-lg">
            <p className="text-2xl font-bold text-foreground">300 DPI</p>
            <p className="text-sm text-muted-foreground">Print-ready resolution</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardGenerator;
