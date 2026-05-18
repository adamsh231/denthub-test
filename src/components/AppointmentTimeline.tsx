import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '../context/DashboardContext';
import type { Appointment, TimelineFilter } from '../types';
import { PatientDetail } from './PatientDetail';
import { Clock, ChevronRight, Activity, Smile, RefreshCw } from 'lucide-react';

export const AppointmentTimeline: React.FC = () => {
  const { appointments, activeAppointmentId, setActiveAppointmentId } = useDashboard();
  const [filter, setFilter] = useState<TimelineFilter>('all');

  const filteredAppointments = appointments.filter((app) => {
    // Only display CONFIRMED and COMPLETED in main timeline flow, and filter by selected tab.
    // REQUESTED has its own Review Deck above it.
    if (app.status === 'REQUESTED') return false;
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const activeApp = appointments.find((a) => a.id === activeAppointmentId);

  return (
    <div className="w-full px-6 md:px-12 py-6">
      {/* Morphing Detail View Layout Anchor */}
      <AnimatePresence mode="wait">
        {activeApp && activeApp.status !== 'REQUESTED' ? (
          <motion.div
            key={`detail-${activeApp.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="mb-8"
          >
            <PatientDetail appointment={activeApp} />
          </motion.div>
        ) : (
          <motion.div
            key="timeline-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Timeline Headers & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-sky-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Alur Kunjungan Pasien Hari Ini
                </h3>
              </div>

              {/* Filter Tabs */}
              <div className="flex bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl w-fit border border-slate-200/20 dark:border-slate-800/40">
                {(['all', 'CONFIRMED', 'COMPLETED'] as TimelineFilter[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
                      filter === tab
                        ? 'bg-white dark:bg-slate-800 text-sky-500 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                    }`}
                  >
                    {tab === 'all' ? 'Semua Sesi' : tab === 'CONFIRMED' ? 'Mendatang' : 'Selesai'}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Vertical Flow Timeline */}
            <div className="relative pl-4 md:pl-6 border-l border-slate-100 dark:border-slate-800/80 space-y-4">
              <AnimatePresence initial={false}>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((app, index) => {
                    const isConfirmed = app.status === 'CONFIRMED';
                    
                    return (
                      <motion.div
                        key={app.id}
                        layoutId={`card-container-${app.id}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ 
                          delay: index * 0.05,
                          type: "spring",
                          stiffness: 300,
                          damping: 24
                        }}
                        onClick={() => setActiveAppointmentId(app.id)}
                        className={`glass-panel cursor-pointer rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 ${
                          isConfirmed 
                            ? 'border-l-sky-500 border-sky-100/40 dark:border-sky-950/10' 
                            : 'border-l-emerald-500 border-emerald-100/40 dark:border-emerald-950/10 opacity-75'
                        }`}
                      >
                        {/* Dot Anchor on Vertical Line */}
                        <div className="absolute left-0 -translate-x-[21px] md:-translate-x-[25px] w-2 h-2 rounded-full border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 flex items-center justify-center">
                          <div className={`w-1 h-1 rounded-full ${isConfirmed ? 'bg-sky-500' : 'bg-emerald-500'}`} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                              <Clock size={13} className="text-slate-400" />
                              {app.time} WIB
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isConfirmed 
                                ? 'bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400' 
                                : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                            }`}>
                              {isConfirmed ? 'UPCOMING' : 'COMPLETED'}
                            </span>
                          </div>

                          <motion.h4 
                            layoutId={`card-name-${app.id}`}
                            className="text-base font-bold text-slate-900 dark:text-white"
                          >
                            {app.patientName}
                          </motion.h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-1">
                            {app.complaint}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-slate-400">
                          <span className="text-xs font-semibold">Tinjau Detail</span>
                          <ChevronRight size={16} />
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 text-center"
                  >
                    <Smile size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                      No appointments yet. Enjoy the quiet.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
