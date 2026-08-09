import React from 'react';
import { Brain } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading Campus IQ...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border-2 border-indigo-500 flex items-center justify-center text-indigo-400 animate-bounce">
          <Brain size={24} />
        </div>
        <div className="absolute -inset-1 rounded-2xl bg-indigo-500/20 blur animate-pulse"></div>
      </div>
      <p className="text-sm font-medium text-slate-400">{message}</p>
    </div>
  );
}
