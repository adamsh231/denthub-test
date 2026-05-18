import React, { createContext, useContext, useState } from 'react'

export interface DentalCode {
  code: string
  name: string
  price: number
  category: string
}

export interface Appointment {
  id: string
  time: string
  patientName: string
  complaint: string
  status: 'REQUESTED' | 'CONFIRMED' | 'COMPLETED'
  completedCodes: DentalCode[]
  diagnosis?: string
  treatmentNote?: string
}

export const DENTAL_CODES_DB: DentalCode[] = [
  { code: 'D0120', name: 'Periodic Oral Evaluation', price: 65.0, category: 'Diagnostic' },
  { code: 'D0210', name: 'Intraoral Comprehensive X-Rays', price: 145.0, category: 'Diagnostic' },
  { code: 'D1110', name: 'Prophylaxis (Cleaning) - Adult', price: 95.0, category: 'Preventive' },
  { code: 'D1208', name: 'Topical Application of Fluoride', price: 40.0, category: 'Preventive' },
  { code: 'D2331', name: 'Resin Composite - 2 Surfaces', price: 210.0, category: 'Restorative' },
  { code: 'D2750', name: 'Crown - Porcelain Fused to High Noble Metal', price: 980.0, category: 'Restorative' },
  { code: 'D3300', name: 'Root Canal Therapy - Anterior', price: 750.0, category: 'Endodontics' },
  { code: 'D4341', name: 'Periodontal Scaling & Root Planing', price: 280.0, category: 'Periodontics' },
  { code: 'D7140', name: 'Extraction, Erupted Tooth or Exposed Root', price: 185.0, category: 'Oral Surgery' },
]

interface BillingStateContextType {
  appointments: Appointment[]
  activeAppointmentId: string | null
  activeAppointment: Appointment | null
  setActiveAppointmentId: (id: string | null) => void
  completeTreatmentCode: (appointmentId: string, dentalCode: DentalCode) => void
  removeTreatmentCode: (appointmentId: string, codeStr: string) => void
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => void
  checkoutAppointment: (appointmentId: string) => void
  // Auto-peek event notifier state
  lastCompletedCode: { code: string; appointmentId: string; timestamp: number } | null
  clearLastCompletedCode: () => void
}

const BillingStateContext = createContext<BillingStateContextType | undefined>(undefined)

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    time: '09:00 AM',
    patientName: 'Rian Wijaya',
    complaint: 'Gigi depan goyang dan ngilu saat minum dingin',
    status: 'CONFIRMED',
    completedCodes: [
      { code: 'D0120', name: 'Periodic Oral Evaluation', price: 65.0, category: 'Diagnostic' },
    ],
    diagnosis: 'Mild pulpitis on tooth 21',
    treatmentNote: 'Recommended cold sensitivity toothpaste'
  },
  {
    id: 'apt-2',
    time: '10:30 AM',
    patientName: 'Siti Rahma',
    complaint: 'Pembersihan karang gigi rutin (scaling)',
    status: 'REQUESTED',
    completedCodes: [],
  },
  {
    id: 'apt-3',
    time: '01:15 PM',
    patientName: 'Budi Santoso',
    complaint: 'Tambalan gigi geraham belakang lepas',
    status: 'CONFIRMED',
    completedCodes: [
      { code: 'D0120', name: 'Periodic Oral Evaluation', price: 65.0, category: 'Diagnostic' },
      { code: 'D2331', name: 'Resin Composite - 2 Surfaces', price: 210.0, category: 'Restorative' }
    ],
    diagnosis: 'Lost composite filling on 46 occlusal',
    treatmentNote: 'Restored with standard composite'
  },
  {
    id: 'apt-4',
    time: '03:00 PM',
    patientName: 'Diana Lestari',
    complaint: 'Konsultasi pasang behel / kawat gigi',
    status: 'COMPLETED',
    completedCodes: [
      { code: 'D0120', name: 'Periodic Oral Evaluation', price: 65.0, category: 'Diagnostic' },
      { code: 'D0210', name: 'Intraoral Comprehensive X-Rays', price: 145.0, category: 'Diagnostic' }
    ],
    diagnosis: 'Class II Malocclusion',
    treatmentNote: 'Referred to orthodontist specialist'
  }
]

export const BillingStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS)
  const [activeAppointmentId, setActiveAppointmentId] = useState<string | null>('apt-1')
  const [lastCompletedCode, setLastCompletedCode] = useState<BillingStateContextType['lastCompletedCode']>(null)

  const activeAppointment = appointments.find(a => a.id === activeAppointmentId) || null

  const completeTreatmentCode = (appointmentId: string, dentalCode: DentalCode) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === appointmentId) {
        // Prevent duplicate codes in same session for simplified view
        const alreadyExists = apt.completedCodes.some(c => c.code === dentalCode.code)
        if (alreadyExists) return apt
        return {
          ...apt,
          completedCodes: [...apt.completedCodes, dentalCode],
        }
      }
      return apt
    }))

    // Dispatch micro-interaction event
    setLastCompletedCode({
      code: dentalCode.code,
      appointmentId,
      timestamp: Date.now()
    })
  }

  const removeTreatmentCode = (appointmentId: string, codeStr: string) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === appointmentId) {
        return {
          ...apt,
          completedCodes: apt.completedCodes.filter(c => c.code !== codeStr)
        }
      }
      return apt
    }))
  }

  const updateAppointmentStatus = (appointmentId: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === appointmentId) {
        return { ...apt, status }
      }
      return apt
    }))
  }

  const checkoutAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === appointmentId) {
        return { ...apt, status: 'COMPLETED' }
      }
      return apt
    }))
    
    // Dispatch checkout event to outer system
    const checkoutEvent = new CustomEvent('denthub-checkout-dispatch', {
      detail: {
        appointmentId,
        appointment: appointments.find(a => a.id === appointmentId),
        timestamp: new Date().toISOString()
      }
    })
    window.dispatchEvent(checkoutEvent)
    
    // Log details for tracking
    console.log(`[DentHub-Checkout] Dispatching instant checkout action for ${appointmentId}`)
  }

  const clearLastCompletedCode = () => {
    setLastCompletedCode(null)
  }

  return (
    <BillingStateContext.Provider value={{
      appointments,
      activeAppointmentId,
      activeAppointment,
      setActiveAppointmentId,
      completeTreatmentCode,
      removeTreatmentCode,
      updateAppointmentStatus,
      checkoutAppointment,
      lastCompletedCode,
      clearLastCompletedCode
    }}>
      {children}
    </BillingStateContext.Provider>
  )
}

export const useBillingState = () => {
  const context = useContext(BillingStateContext)
  if (!context) {
    throw new Error('useBillingState must be used within a BillingStateProvider')
  }
  return context
}
