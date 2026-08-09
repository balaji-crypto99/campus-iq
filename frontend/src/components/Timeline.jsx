import React from 'react';
import { CheckCircle2, Clock, Brain, UserCheck, Wrench, ShieldAlert } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function Timeline({ grievance }) {
  const steps = [
    {
      id: 'SUBMITTED',
      title: 'Submitted',
      description: 'Grievance received in system',
      date: grievance.createdAt,
      icon: Clock,
      completed: true,
    },
    {
      id: 'AI_ANALYZED',
      title: 'AI Analyzed',
      description: grievance.aiSummary ? `Severity ${grievance.severityScore}/100 - ${grievance.priority} priority` : 'AI evaluation in progress',
      date: grievance.createdAt,
      icon: Brain,
      completed: grievance.aiStatus === 'SUCCESS' || !!grievance.aiSummary,
    },
    {
      id: 'ASSIGNED',
      title: 'Assigned',
      description: grievance.assignedDepartment ? `Assigned to ${grievance.assignedDepartment}` : 'Awaiting department routing',
      date: grievance.updatedAt,
      icon: UserCheck,
      completed: ['ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].includes(grievance.status),
    },
    {
      id: 'IN_PROGRESS',
      title: 'In Progress',
      description: 'Department technician active on-site',
      date: grievance.updatedAt,
      icon: Wrench,
      completed: ['IN_PROGRESS', 'RESOLVED'].includes(grievance.status),
    },
    {
      id: 'RESOLVED',
      title: 'Resolved',
      description: grievance.resolvedAt ? `Resolved on ${formatDate(grievance.resolvedAt)}` : 'Awaiting resolution',
      date: grievance.resolvedAt,
      icon: CheckCircle2,
      completed: grievance.status === 'RESOLVED',
    },
  ];

  return (
    <div className="py-4">
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={step.id} className="relative flex md:flex-col items-center flex-1 z-10 w-full md:w-auto">
              
              {/* Connector line for desktop */}
              {idx < steps.length - 1 && (
                <div
                  className={`hidden md:block absolute top-5 left-[50%] w-full h-0.5 ${
                    step.completed ? 'bg-indigo-500' : 'bg-slate-800'
                  }`}
                />
              )}

              <div className="flex items-center space-x-3 md:space-x-0 md:flex-col md:text-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    step.completed
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}
                >
                  <Icon size={18} />
                </div>

                <div className="mt-2 space-y-0.5">
                  <p className={`text-xs font-bold ${step.completed ? 'text-white' : 'text-slate-500'}`}>
                    {step.title}
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-[140px] leading-tight">
                    {step.description}
                  </p>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
