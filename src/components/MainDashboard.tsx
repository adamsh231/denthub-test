import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '../context/DashboardContext';
import { useBatteryStatus } from '../hooks/useBatteryStatus';
import { Header } from './Header';
import { WeeklyOverview } from './WeeklyOverview';
import { RequestReview } from './RequestReview';
import { AppointmentTimeline } from './AppointmentTimeline';
import { Calendar, Plus, Battery, BatteryCharging, Sparkles, Smile, ShieldAlert } from 'lucide-react';

export const MainDashboard: React.FC = () => {
  const { appointments, addAppointment } = useDashboard();
  const { batteryLevel, isCharging } = useBatteryStatus();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newComplaint, setNewComplaint] = useState('');
  const [newTime, setNewTime] = useState('09:00');
  const [newAge, setNewAge] = useState(30);
  const [newGender, setNewGender] = useState('Laki-laki');
  const [newPhone, setNewPhone] = useState('+62 812-');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !newComplaint.trim()) return;

    addAppointment({
      time: newTime,
      patientName: newPatientName,
      complaint: newComplaint,
      status: 'REQUESTED', // Default as a request review card
      age: Number(newAge),
      gender: newGender,
      phone: newPhone,
      lastVisit: 'Kunjungan Baru',
      notes: '',
      diagnosis: '',
      treatment: ''
    });

    // Reset Form Fields
    setNewPatientName('');
    setNewComplaint('');
    setNewTime('09:00');
    setNewAge(30);
    setNewGender('Laki-laki');
    setNewPhone('+62 812-');
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/20 dark:bg-slate-950/10 flex flex-col pb-16">
      {/* Battery Indicator Status Bar for Tablets */}
      <div className="w-full bg-slate-100/50 dark:bg-slate-900/30 px-6 md:px-12 py-1.5 flex justify-between items-center text-[10px] font-semibold text-slate-500 tracking-wider border-b border-slate-200/10">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          DENTHUB APPFRAME TABLET LAYER v1.0
        </span>
        <div className="flex items-center gap-2">
          {batteryLevel !== null ? (
            <span className="flex items-center gap-1">
              {isCharging ? (
                <BatteryCharging size={11} className="text-emerald-500" />
              ) : (
                <Battery size={11} className="text-slate-400" />
              )}
              {batteryLevel}%
            </span>
          ) : (
            <span>BATTERY OPTIMIZED</span>
          )}
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
          <span>HARDWARE ACCELERATED</span>
        </div>
      </div>

      <Header />
      
      <WeeklyOverview />

      <RequestReview />

      <AppointmentTimeline />

      {/* Floating Action Button for Adding Sample Sesi (Simulated Doctor Flow) */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-14 h-14 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/20 cursor-pointer"
        >
          <Plus size={24} className={`transition-transform duration-300 ${showAddForm ? 'rotate-45' : ''}`} />
        </motion.button>
      </div>

      {/* Add Sesi Floating Modal Form */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="glass-panel w-full max-w-md rounded-3xl p-6 shadow-2xl relative border border-slate-100 dark:border-slate-800"
            >
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-1.5">
                <Sparkles size={18} className="text-amber-500" />
                Tambah Janji Temu Baru
              </h3>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Pasien</label>
                  <input
                    type="text"
                    required
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    placeholder="e.g. Rinaldi Pratama"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Umur (Tahun)</label>
                    <input
                      type="number"
                      required
                      value={newAge}
                      onChange={(e) => setNewAge(Number(e.target.value))}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Gender</label>
                    <select
                      value={newGender}
                      onChange={(e) => setNewGender(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Waktu Sesi</label>
                    <input
                      type="text"
                      required
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      placeholder="e.g. 11:45"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">No. Telepon</label>
                    <input
                      type="text"
                      required
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Keluhan Utama</label>
                  <textarea
                    required
                    value={newComplaint}
                    onChange={(e) => setNewComplaint(e.target.value)}
                    placeholder="e.g. Nyeri gigi berdenyut sejak kemarin malam..."
                    rows={3}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl px-4 py-2 text-xs font-bold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl px-4 py-2 text-xs font-bold cursor-pointer shadow-md shadow-sky-500/10"
                  >
                    Kirim Permintaan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
