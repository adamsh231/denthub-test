import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '../context/DashboardContext';
import { X, Check } from 'lucide-react';

export const RequestReview: React.FC = () => {
  const { appointments, approveAppointment, rejectAppointment } = useDashboard();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const requestedAppointments = appointments.filter(a => a.status === 'REQUESTED');

  const handleApprove = (id: string) => {
    approveAppointment(id);
  };

  const handleRejectInitiate = (id: string) => {
    setRejectingId(id);
    setRejectReason('');
  };

  const handleRejectConfirm = (id: string) => {
    if (!rejectReason.trim()) return;
    rejectAppointment(id, rejectReason);
    setRejectingId(null);
    setRejectReason('');
  };

  const handleCancelReject = () => {
    setRejectingId(null);
    setRejectReason('');
  };

  if (requestedAppointments.length === 0) return null;

  return (
    <div className="w-full px-6 md:px-12 py-6">
      <div className="flex items-center gap-2 mb-4 px-1">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Tinjauan Permintaan Sesi ({requestedAppointments.length})
        </h3>
      </div>

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {requestedAppointments.map((app) => (
            <motion.div
              key={app.id}
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ 
                opacity: 0, 
                x: 100, 
                transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } 
              }}
              className="glass-panel rounded-2xl p-5 shadow-sm border border-amber-100/40 dark:border-amber-950/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-md">
                    {app.time} WIB
                  </span>
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                    Requested Appointment
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  {app.patientName}
                </h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  "{app.complaint}"
                </p>
              </div>

              {/* Action and Rejection UI inline */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 min-w-[200px]">
                {rejectingId === app.id ? (
                  <motion.div 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full"
                  >
                    <input
                      type="text"
                      placeholder="Alasan penolakan..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 w-full sm:w-48"
                      autoFocus
                    />
                    <div className="flex gap-1.5 justify-end">
                      <button
                        onClick={() => handleRejectConfirm(app.id)}
                        className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors duration-200"
                      >
                        Ya, Tolak
                      </button>
                      <button
                        onClick={handleCancelReject}
                        className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors duration-200"
                      >
                        Batal
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-2 w-full justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRejectInitiate(app.id)}
                      className="bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors duration-300"
                    >
                      <X size={14} />
                      Tolak
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApprove(app.id)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors duration-300 shadow-sm shadow-emerald-500/10"
                    >
                      <Check size={14} />
                      Terima Sesi
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
