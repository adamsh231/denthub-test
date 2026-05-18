import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '../context/DashboardContext';
import type { Appointment } from '../types';
import { X, Check } from 'lucide-react';

interface PatientDetailProps {
  appointment: Appointment;
}

export const PatientDetail: React.FC<PatientDetailProps> = ({ appointment }) => {
  const { setActiveAppointmentId, updateAppointment } = useDashboard();
  const [diagnosis, setDiagnosis] = useState(appointment.diagnosis || '');
  const [treatment, setTreatment] = useState(appointment.treatment || '');
  const [notes, setNotes] = useState(appointment.notes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedDot, setShowSavedDot] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate lightweight autosave/saving transition
    setTimeout(() => {
      updateAppointment(appointment.id, {
        diagnosis,
        treatment,
        notes
      });
      setIsSaving(false);
      setShowSavedDot(true);
      
      // Auto-hide success check state and morph panel back into list card
      setTimeout(() => {
        setShowSavedDot(false);
        setActiveAppointmentId(null);
      }, 1000);
    }, 800);
  };

  return (
    <motion.div
      layoutId={`card-container-${appointment.id}`}
      className="glass-panel w-full rounded-3xl p-6 md:p-8 shadow-lg relative border border-sky-100/50 dark:border-sky-950/20"
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
    >
      {/* Header and Close Action Button */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            Detail Pasien
          </span>
          <motion.h2 
            layoutId={`card-name-${appointment.id}`}
            className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mt-2 mb-1"
          >
            {appointment.patientName}
          </motion.h2>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
            <span>{appointment.age} Tahun</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
            <span>{appointment.gender}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
            <span>Kunjungan terakhir: {appointment.lastVisit}</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveAppointmentId(null)}
          className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
        >
          <X size={18} />
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Patient Core Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl p-5 border border-slate-100/50 dark:border-slate-800/30">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Informasi Keluhan</h4>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
              "{appointment.complaint}"
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">Kontak Pasien</h4>
            <div className="bg-slate-50/30 dark:bg-slate-900/10 rounded-xl p-3 flex justify-between items-center text-sm border border-slate-100/30 dark:border-slate-800/10">
              <span className="text-slate-500">No. Telepon</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{appointment.phone}</span>
            </div>
            <div className="bg-slate-50/30 dark:bg-slate-900/10 rounded-xl p-3 flex justify-between items-center text-sm border border-slate-100/30 dark:border-slate-800/10">
              <span className="text-slate-500">Waktu Sesi</span>
              <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                {appointment.time} WIB
              </span>
            </div>
          </div>
        </div>

        {/* Visit Notes Ultra-Minimal Form */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                Diagnosis
              </label>
              {showSavedDot && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              )}
            </div>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Masukkan diagnosis klinis gigi (e.g. Pulpitis reversible gigi 36)..."
              rows={2}
              className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Tindakan (Treatment)
            </label>
            <input
              type="text"
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              placeholder="Pembersihan kalkulus / preparasi kavitas / tumpatan..."
              className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Catatan Kunjungan Tambahan
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instruksi pasca tindakan atau janji temu lanjutan..."
              rows={3}
              className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 resize-none"
            />
          </div>

          {/* Action Buttons with Morph Transitions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
                isSaving ? 'bg-sky-500 animate-pulse' : showSavedDot ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
              }`} />
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {isSaving ? 'Menyimpan...' : showSavedDot ? 'Tersimpan' : 'Perubahan tersimpan otomatis'}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isSaving}
              className="glass-panel px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm flex items-center gap-2 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-600 dark:hover:text-white transition-colors duration-300 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                  Memproses...
                </>
              ) : showSavedDot ? (
                <>
                  <Check size={16} className="text-emerald-500" />
                  Selesai
                </>
              ) : (
                <>
                  Simpan Catatan
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
