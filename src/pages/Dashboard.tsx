import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  CreditCard, 
  FileUp, 
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useStudents } from '@/contexts/StudentContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Dashboard: React.FC = () => {
  const { students } = useStudents();

  const stats = [
    { 
      label: 'Total Students', 
      value: students.length, 
      icon: Users, 
      color: 'bg-accent text-accent-foreground',
      trend: '+12%',
      trendUp: true
    },
    { 
      label: 'Cards Generated', 
      value: Math.floor(students.length * 0.8), 
      icon: CreditCard, 
      color: 'bg-success text-success-foreground',
      trend: '+8%',
      trendUp: true
    },
    { 
      label: 'Pending', 
      value: Math.ceil(students.length * 0.2), 
      icon: Clock, 
      color: 'bg-warning text-warning-foreground',
      trend: '-5%',
      trendUp: false
    },
    { 
      label: 'Templates', 
      value: 3, 
      icon: FileUp, 
      color: 'bg-primary text-primary-foreground',
    },
  ];

  const quickActions = [
    { label: 'Add Student', path: '/students', icon: Users },
    { label: 'Generate Cards', path: '/cards', icon: CreditCard },
    { label: 'Import Data', path: '/import', icon: FileUp },
  ];

  const recentActivity = [
    { type: 'success', message: 'Generated 25 student cards', time: '2 hours ago' },
    { type: 'info', message: 'Imported 50 students from CSV', time: '5 hours ago' },
    { type: 'warning', message: '3 students missing photos', time: '1 day ago' },
    { type: 'success', message: 'Template "Fall 2024" created', time: '2 days ago' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's an overview of your card generation system.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <div 
            key={stat.label}
            className="card-elevated p-6 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              {stat.trend && (
                <div className={cn(
                  "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
                  stat.trendUp ? "text-success bg-success/10" : "text-warning bg-warning/10"
                )}>
                  <TrendingUp className={cn("w-4 h-4", !stat.trendUp && "rotate-180")} />
                  {stat.trend}
                </div>
              )}
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 card-elevated p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <Link key={action.path} to={action.path}>
                <Button variant="secondary" className="w-full justify-between group">
                  <span className="flex items-center gap-3">
                    <action.icon className="w-5 h-5 text-accent" />
                    {action.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 card-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
            <Button variant="ghost" size="sm" className="text-accent">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  activity.type === 'success' && "bg-success/10 text-success",
                  activity.type === 'info' && "bg-accent/10 text-accent",
                  activity.type === 'warning' && "bg-warning/10 text-warning"
                )}>
                  {activity.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                  {activity.type === 'info' && <FileUp className="w-4 h-4" />}
                  {activity.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Departments Overview */}
      <div className="card-elevated p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Students by Department</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Computer Science', count: 2, color: 'bg-accent' },
            { name: 'Electrical Engineering', count: 1, color: 'bg-success' },
            { name: 'Business Administration', count: 1, color: 'bg-warning' },
            { name: 'Other', count: 0, color: 'bg-muted' },
          ].map((dept) => (
            <div key={dept.name} className="p-4 bg-secondary rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("w-3 h-3 rounded-full", dept.color)} />
                <span className="text-sm font-medium text-foreground truncate">{dept.name}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{dept.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
