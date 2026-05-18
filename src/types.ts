export interface Appointment {
  id: string;
  time: string;
  patientName: string;
  complaint: string;
  status: 'REQUESTED' | 'CONFIRMED' | 'COMPLETED';
  age?: number;
  gender?: string;
  phone?: string;
  lastVisit?: string;
  notes?: string;
  diagnosis?: string;
  treatment?: string;
}

export type TimelineFilter = 'all' | 'REQUESTED' | 'CONFIRMED' | 'COMPLETED';
