import React, { useState, useCallback } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  Check, 
  AlertTriangle, 
  ArrowRight,
  X,
  FileText,
  Download,
  Loader2
} from 'lucide-react';
import Papa from 'papaparse';
import { useStudents } from '@/contexts/StudentContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ImportStep = 'upload' | 'mapping' | 'preview' | 'complete';

const ImportData: React.FC = () => {
  const { addStudent } = useStudents();
  const [step, setStep] = useState<ImportStep>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'text/csv' || 
          droppedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          droppedFile.name.endsWith('.csv') ||
          droppedFile.name.endsWith('.xlsx')) {
        setFile(droppedFile);
        setStep('mapping');
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStep('mapping');
    }
  };

  const steps = [
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'mapping', label: 'Map Fields', icon: FileSpreadsheet },
    { id: 'preview', label: 'Preview', icon: FileText },
    { id: 'complete', label: 'Complete', icon: Check },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Import Data</h1>
        <p className="text-muted-foreground mt-1">Bulk import students from CSV or Excel files</p>
      </div>

      {/* Progress Steps */}
      <div className="card-elevated p-4">
        <div className="flex items-center justify-between">
          {steps.map((s, index) => (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  step === s.id || steps.findIndex(st => st.id === step) > index
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-muted-foreground"
                )}>
                  <s.icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "text-sm font-medium hidden sm:block",
                  step === s.id ? "text-foreground" : "text-muted-foreground"
                )}>
                  {s.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 mx-2",
                  steps.findIndex(st => st.id === step) > index
                    ? "bg-accent"
                    : "bg-secondary"
                )} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="card-elevated p-6">
        {step === 'upload' && (
          <div className="space-y-6">
            <div
              className={cn(
                "border-2 border-dashed rounded-xl p-12 text-center transition-colors",
                dragActive 
                  ? "border-accent bg-accent/5" 
                  : "border-border hover:border-accent/50"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Drop your file here
              </h3>
              <p className="text-muted-foreground mb-4">
                or click to browse from your computer
              </p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".csv,.xlsx"
                onChange={handleFileSelect}
              />
              <label htmlFor="file-upload">
                <Button variant="hero" className="cursor-pointer" asChild>
                  <span>Choose File</span>
                </Button>
              </label>
              <p className="text-sm text-muted-foreground mt-4">
                Supported formats: CSV, XLSX (max 10MB)
              </p>
            </div>

            {/* Sample Download */}
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div>
                <p className="font-medium text-foreground">Need a template?</p>
                <p className="text-sm text-muted-foreground">Download our sample file with correct headers</p>
              </div>
              <Button variant="outline" onClick={() => {
                const headers = ['Roll Number', 'Student Name', 'Father Name', 'Department', 'Program', 'Blood Group', 'Contact No', 'Address'];
                const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "student_template.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}>
                <Download className="w-4 h-4" />
                Download Template
              </Button>
            </div>
          </div>
        )}

        {step === 'mapping' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-8 h-8 text-accent" />
                <div>
                  <p className="font-medium text-foreground">{file?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {file && (file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => { setFile(null); setStep('upload'); }}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Field Mapping</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We've auto-detected your columns. Please verify the mapping below:
              </p>
              
              <div className="space-y-3">
                {[
                  { source: 'Roll Number', target: 'roll_no', matched: true },
                  { source: 'Student Name', target: 'name', matched: true },
                  { source: 'Father Name', target: 'father_name', matched: true },
                  { source: 'Department', target: 'department', matched: true },
                  { source: 'Program', target: 'program', matched: true },
                  { source: 'Blood Group', target: 'blood_group', matched: true },
                  { source: 'Contact No', target: 'contact', matched: true },
                  { source: 'Address', target: 'address', matched: false },
                ].map((mapping, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-lg",
                      mapping.matched ? "bg-success/10" : "bg-warning/10"
                    )}
                  >
                    <div className="flex-1">
                      <span className="text-sm font-medium text-foreground">{mapping.source}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-sm text-foreground">{mapping.target}</span>
                      {mapping.matched ? (
                        <Check className="w-4 h-4 text-success" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-warning" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setStep('upload')}>
                Back
              </Button>
              <Button variant="hero" onClick={() => {
                 if (file) {
                    setIsProcessing(true);
                    Papa.parse(file, {
                      header: true,
                      complete: (results) => {
                        setParsedData(results.data);
                        setIsProcessing(false);
                        setStep('preview');
                      },
                      error: (error) => {
                        console.error('Error parsing CSV:', error);
                        toast.error('Failed to parse CSV file');
                        setIsProcessing(false);
                      }
                    });
                 }
              }} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Parsing...
                  </>
                ) : (
                  'Continue to Preview'
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-success/10 rounded-lg text-center flex-1">
                <p className="text-2xl font-bold text-success">
                  {parsedData.filter(d => d['Roll Number'] && d['Student Name']).length}
                </p>
                <p className="text-sm text-muted-foreground">Valid Records</p>
              </div>
              <div className="p-4 bg-warning/10 rounded-lg text-center flex-1">
                <p className="text-2xl font-bold text-warning">
                  {parsedData.filter(d => (!d['Roll Number'] || !d['Student Name']) && (d['Roll Number'] || d['Student Name'])).length}
                </p>
                <p className="text-sm text-muted-foreground">Incomplete</p>
              </div>
              <div className="p-4 bg-destructive/10 rounded-lg text-center flex-1">
                <p className="text-2xl font-bold text-destructive">0</p>
                <p className="text-sm text-muted-foreground">Errors</p>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full text-sm">
                <thead className="bg-secondary sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-foreground">Roll No</th>
                    <th className="px-4 py-2 text-left font-semibold text-foreground">Name</th>
                    <th className="px-4 py-2 text-left font-semibold text-foreground">Father Name</th>
                    <th className="px-4 py-2 text-left font-semibold text-foreground">Department</th>
                    <th className="px-4 py-2 text-left font-semibold text-foreground">Program</th>
                    <th className="px-4 py-2 text-left font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {parsedData.map((row, i) => {
                    if (!row['Roll Number'] && !row['Student Name']) return null;
                    const isValid = row['Roll Number'] && row['Student Name'];
                    return (
                    <tr key={i}>
                      <td className="px-4 py-3 font-mono">{row['Roll Number']}</td>
                      <td className="px-4 py-3">{row['Student Name']}</td>
                      <td className="px-4 py-3">{row['Father Name']}</td>
                      <td className="px-4 py-3">{row['Department']}</td>
                      <td className="px-4 py-3">{row['Program']}</td>
                      <td className="px-4 py-3">
                        {isValid ? (
                          <span className="inline-flex items-center gap-1 text-success">
                            <Check className="w-4 h-4" /> Valid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-warning">
                            <AlertTriangle className="w-4 h-4" /> Missing info
                          </span>
                        )}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setStep('mapping')}>
                Back
              </Button>
              <Button variant="hero" onClick={async () => {
                let importedCount = 0;
                setIsProcessing(true);
                for (const row of parsedData) {
                  if (row['Roll Number'] && row['Student Name']) {
                     await addStudent({
                       roll_no: row['Roll Number'],
                       name: row['Student Name'],
                       father_name: row['Father Name'] || '',
                       department: row['Department'] || '',
                       program: row['Program'] || '',
                       blood_group: row['Blood Group'] || 'O+',
                       contact: row['Contact No'] || '',
                       address: row['Address'] || '',
                       session: '',
                       emergency_contact: '',
                       valid_from: new Date().toISOString().split('T')[0],
                       valid_until: new Date(new Date().setFullYear(new Date().getFullYear() + 4)).toISOString().split('T')[0]
                     });
                     importedCount++;
                  }
                }
                setIsProcessing(false);
                setStep('complete');
              }} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  `Import ${parsedData.filter(d => d['Roll Number'] && d['Student Name']).length} Students`
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-success" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Import Complete!</h3>
            <p className="text-muted-foreground mb-6">
              48 students have been successfully imported to the system.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => { setStep('upload'); setFile(null); }}>
                Import More
              </Button>
              <Button variant="hero">
                View Students
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportData;
