import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Appointment } from '../types';

interface DashboardContextType {
  appointments: Appointment[];
  activeAppointmentId: string | null;
  setActiveAppointmentId: (id: string | null) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  approveAppointment: (id: string) => void;
  rejectAppointment: (id: string, reason: string) => void;
  isWeeklyOverviewExpanded: boolean;
  setIsWeeklyOverviewExpanded: (expanded: boolean) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
}

const initialAppointments: Appointment[] = [
  {
    id: '1',
    time: '09:00',
    patientName: 'Budi Santoso',
    complaint: 'Gigi geraham bawah kiri ngilu saat minum dingin',
    status: 'CONFIRMED',
    age: 34,
    gender: 'Laki-laki',
    phone: '+62 812-3456-7890',
    lastVisit: '3 bulan lalu',
    notes: 'Pasien memiliki riwayat sensitivitas gigi tinggi.',
    diagnosis: 'Pulpitis reversible gigi 36',
    treatment: 'Restorasi resin komposit'
  },
  {
    id: '2',
    time: '10:30',
    patientName: 'Siti Rahma',
    complaint: 'Pembersihan karang gigi rutin (Scaling)',
    status: 'REQUESTED',
    age: 28,
    gender: 'Perempuan',
    phone: '+62 813-9876-5432',
    lastVisit: '6 bulan lalu',
    notes: 'Kalkulus sedang di regio anterior bawah.',
    diagnosis: '',
    treatment: ''
  },
  {
    id: '3',
    time: '13:00',
    patientName: 'Dewi Lestari',
    complaint: 'Pemasangan kembali crown gigi depan lepas',
    status: 'CONFIRMED',
    age: 41,
    gender: 'Perempuan',
    phone: '+62 811-2233-4455',
    lastVisit: '1 bulan lalu',
    notes: 'Crown porselen lepasan dari gigi 11.',
    diagnosis: 'Crown cementation failure gigi 11',
    treatment: 'Recementation crown gigi 11'
  },
  {
    id: '4',
    time: '14:30',
    patientName: 'Andi Wijaya',
    complaint: 'Kontrol rutin behel gigi bulanan',
    status: 'COMPLETED',
    age: 22,
    gender: 'Laki-laki',
    phone: '+62 815-5555-6666',
    lastVisit: '4 minggu lalu',
    notes: 'Ganti kawat archwire dan ligatur karet.',
    diagnosis: 'Maloklusi Kelas I dengan crowding',
    treatment: 'Adjustment orthodontic bracket'
  }
];

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [activeAppointmentId, setActiveAppointmentId] = useState<string | null>(null);
  const [isWeeklyOverviewExpanded, setIsWeeklyOverviewExpanded] = useState<boolean>(false);

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...updates } : app))
    );
  };

  const approveAppointment = (id: string) => {
    updateAppointment(id, { status: 'CONFIRMED' });
  };

  const rejectAppointment = (id: string, reason: string) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === id
          ? { ...app, status: 'COMPLETED', notes: `Rejected: ${reason}. Original: ${app.notes}` }
          : app
      )
    );
  };

  const addAppointment = (newApp: Omit<Appointment, 'id'>) => {
    const id = (appointments.length + 1).toString();
    setAppointments((prev) => [...prev, { ...newApp, id }]);
  };

  return (
    <DashboardContext.Provider
      value={{
        appointments,
        activeAppointmentId,
        setActiveAppointmentId,
        updateAppointment,
        approveAppointment,
        rejectAppointment,
        isWeeklyOverviewExpanded,
        setIsWeeklyOverviewExpanded,
        addAppointment,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
