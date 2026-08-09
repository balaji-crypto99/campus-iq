import React from 'react';
import { Brain, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-sm">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-indigo-400" />
          <span className="font-semibold text-white">Campus IQ</span>
          <span>— AI-Powered Campus Grievance Early Warning System</span>
        </div>
        <div className="flex items-center space-x-6 text-xs text-slate-400">
          <span className="flex items-center space-x-1">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>256-Bit Encrypted & Compliant</span>
          </span>
          <span>© 2026 Campus IQ Inc. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
