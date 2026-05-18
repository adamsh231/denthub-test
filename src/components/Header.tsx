import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '../context/DashboardContext';

export const Header: React.FC = () => {
  const { appointments } = useDashboard();
  
  const upcomingCount = appointments.filter(a => a.status === 'CONFIRMED').length;
  const pendingCount = appointments.filter(a => a.status === 'REQUESTED').length;
  
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = time.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedTime = time.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full flex flex-col md:flex-row md:items-end justify-between py-8 px-6 md:px-12 border-b border-slate-100/80 dark:border-slate-800/40"
    >
      <div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-1"
        >
          DentHub Clinical Center
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-light text-slate-900 dark:text-white leading-tight m-0 p-0 tracking-tight">
          Good morning, <span className="font-semibold text-sky-500">Doctor</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-2">
          <span>{formattedDate}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
          <span className="font-medium text-slate-700 dark:text-slate-300">{formattedTime} WIB</span>
        </p>
      </div>

      <div className="flex gap-3 mt-4 md:mt-0">
        <div className="glass-panel py-2 px-4 rounded-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{upcomingCount} upcoming</span>
        </div>
        <div className="glass-panel py-2 px-4 rounded-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{pendingCount} pending</span>
        </div>
      </div>
    </motion.header>
  );
};
