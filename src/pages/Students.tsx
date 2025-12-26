import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  MoreVertical
} from 'lucide-react';
import { useStudents } from '@/contexts/StudentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { StudentFormDialog } from '@/components/students/StudentFormDialog';
import { StudentPreviewDialog } from '@/components/students/StudentPreviewDialog';
import type { Student, StudentFormData } from '@/types/student';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 10;

const Students: React.FC = () => {
  const { 
    students, 
    selectedStudents, 
    toggleSelectStudent, 
    selectAllStudents, 
    clearSelection,
    deleteStudent,
    addStudent,
    updateStudent
  } = useStudents();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [previewStudent, setPreviewStudent] = useState<Student | null>(null);

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    
    const query = searchQuery.toLowerCase();
    return students.filter(student => 
      student.name.toLowerCase().includes(query) ||
      student.roll_no.toLowerCase().includes(query) ||
      student.department.toLowerCase().includes(query) ||
      student.program.toLowerCase().includes(query)
    );
  }, [students, searchQuery]);

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStudents.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const isAllSelected = students.length > 0 && selectedStudents.length === students.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAllStudents();
    }
  };

  const handleAddStudent = async (data: StudentFormData) => {
    await addStudent(data);
    setIsAddDialogOpen(false);
  };

  const handleEditStudent = async (data: StudentFormData) => {
    if (editingStudent) {
      await updateStudent(editingStudent.id, data);
      setEditingStudent(null);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      await deleteStudent(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground mt-1">Manage student records for card generation</p>
        </div>
        <Button variant="hero" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-5 h-5" />
          Add Student
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="card-elevated p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search by name, roll number, department..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => {
              const headers = ['Roll No', 'Name', 'Father Name', 'Department', 'Program', 'Session', 'Blood Group', 'Contact', 'Address'];
              const csvContent = "data:text/csv;charset=utf-8," 
                + headers.join(",") + "\n"
                + students.map(s => {
                  return [
                    s.roll_no, 
                    s.name, 
                    s.father_name, 
                    s.department, 
                    s.program, 
                    s.session, 
                    s.blood_group, 
                    s.contact, 
                    s.address
                  ].map(field => `"${field}"`).join(",");
                }).join("\n");
              
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "students_export.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}>
              <Download className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {selectedStudents.length > 0 && (
          <div className="mt-4 flex items-center gap-4 p-3 bg-accent/10 rounded-lg">
            <span className="text-sm text-foreground font-medium">
              {selectedStudents.length} student(s) selected
            </span>
            <Button variant="outline" size="sm" onClick={clearSelection}>
              Clear Selection
            </Button>
            <Button variant="accent" size="sm">
              Generate Cards
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="w-12 px-4 py-3">
                  <Checkbox 
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Roll No</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground hidden md:table-cell">Department</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground hidden lg:table-cell">Program</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground hidden xl:table-cell">Session</th>
                <th className="w-20 px-4 py-3 text-center text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedStudents.map((student) => (
                <tr 
                  key={student.id} 
                  className={cn(
                    "hover:bg-secondary/50 transition-colors",
                    selectedStudents.includes(student.id) && "bg-accent/5"
                  )}
                >
                  <td className="px-4 py-3">
                    <Checkbox 
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={() => toggleSelectStudent(student.id)}
                      aria-label={`Select ${student.name}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono text-foreground">{student.roll_no}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{student.name}</p>
                        <p className="text-xs text-muted-foreground md:hidden">{student.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm text-foreground">{student.department}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-sm text-foreground">{student.program}</span>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <span className="text-sm text-muted-foreground">{student.session}</span>
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setPreviewStudent(student)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingStudent(student)}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No students found</p>
            {searchQuery && (
              <Button 
                variant="link" 
                onClick={() => setSearchQuery('')}
                className="mt-2"
              >
                Clear search
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredStudents.length)} of {filteredStudents.length}
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-foreground px-2">
                {currentPage} / {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <StudentFormDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddStudent}
        title="Add New Student"
      />

      <StudentFormDialog 
        open={!!editingStudent}
        onOpenChange={(open) => !open && setEditingStudent(null)}
        onSubmit={handleEditStudent}
        student={editingStudent || undefined}
        title="Edit Student"
      />

      <StudentPreviewDialog
        open={!!previewStudent}
        onOpenChange={(open) => !open && setPreviewStudent(null)}
        student={previewStudent}
      />
    </div>
  );
};

export default Students;
