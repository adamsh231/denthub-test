import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '../context/DashboardContext';
import { ChevronDown, Calendar } from 'lucide-react';

export const WeeklyOverview: React.FC = () => {
  const { isWeeklyOverviewExpanded, setIsWeeklyOverviewExpanded } = useDashboard();

  // Mock weekly calendar schedule for privacy-first visual
  const weekDays = [
    { name: 'Sen', date: '18 Mei', slots: [{ type: 'busy', h: 10 }, { type: 'free', h: 4 }, { type: 'busy', h: 6 }] },
    { name: 'Sel', date: '19 Mei', slots: [{ type: 'free', h: 12 }, { type: 'busy', h: 8 }] },
    { name: 'Rab', date: '20 Mei', slots: [{ type: 'busy', h: 14 }, { type: 'free', h: 6 }] },
    { name: 'Kam', date: '21 Mei', slots: [{ type: 'busy', h: 4 }, { type: 'free', h: 16 }] },
    { name: 'Jum', date: '22 Mei', slots: [{ type: 'busy', h: 18 }, { type: 'free', h: 2 }] },
    { name: 'Sab', date: '23 Mei', slots: [{ type: 'free', h: 20 }] },
  ];

  return (
    <div className="w-full px-6 md:px-12 py-4">
      {/* Collapsed Ribbon Trigger */}
      <div 
        onClick={() => setIsWeeklyOverviewExpanded(!isWeeklyOverviewExpanded)}
        className="glass-panel cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors duration-300 rounded-2xl p-4 flex items-center justify-between shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center text-sky-500">
            <Calendar size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Weekly Overview</h3>
            <p className="text-xs text-slate-500">Visualisasi kepadatan jadwal minggu ini (Privacy-First)</p>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isWeeklyOverviewExpanded ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-slate-400"
        >
          <ChevronDown size={18} />
        </motion.div>
      </div>

      {/* Accordion Content */}
      <AnimatePresence initial={false}>
        {isWeeklyOverviewExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ 
              height: "auto", 
              opacity: 1, 
              marginTop: 16,
              transition: {
                height: { type: "spring", stiffness: 300, damping: 25 },
                opacity: { duration: 0.25 }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0, 
              marginTop: 0,
              transition: {
                height: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.15 }
              }
            }}
            className="overflow-hidden"
          >
            <div className="glass-panel rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {weekDays.map((day, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, type: "spring", stiffness: 260, damping: 20 }}
                  key={day.name}
                  className="bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100/50 dark:border-slate-800/30 rounded-xl p-4 flex flex-col justify-between min-h-[140px]"
                >
                  <div>
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">{day.name}</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{day.date}</span>
                  </div>

                  {/* Privacy-first timeline bar block */}
                  <div className="w-full h-8 flex gap-0.5 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 mt-4">
                    {day.slots.map((slot, sIdx) => (
                      <div 
                        key={sIdx}
                        style={{ flexGrow: slot.h }}
                        className={`h-full transition-all duration-300 ${
                          slot.type === 'busy' 
                            ? 'bg-sky-500/30 dark:bg-sky-500/25 border-r border-sky-500/10' 
                            : 'bg-emerald-500/20 dark:bg-emerald-500/15'
                        }`}
                        title={slot.type === 'busy' ? 'Busy slot' : 'Available slot'}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
