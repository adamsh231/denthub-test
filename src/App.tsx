import { useState, useEffect } from 'react'
import { BillingStateProvider, useBillingState, DENTAL_CODES_DB, DentalCode } from './context/BillingStateContext'
import { BillingOverlay } from './components/BillingOverlay'
import { 
  Sparkles, 
  FileText, 
  Calendar, 
  Search,
  Check,
  CreditCard
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function Dashboard() {
  const {
    appointments,
    activeAppointmentId,
    activeAppointment,
    setActiveAppointmentId,
    completeTreatmentCode,
    removeTreatmentCode,
    updateAppointmentStatus,
    checkoutAppointment
  } = useBillingState()

  // State to manage input notes
  const [diagnosisInput, setDiagnosisInput] = useState('')
  const [treatmentNoteInput, setTreatmentNoteInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [showSaveDot, setShowSaveDot] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'CONFIRMED' | 'REQUESTED' | 'COMPLETED'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  // Sync inputs with active appointment
  useEffect(() => {
    if (activeAppointment) {
      setDiagnosisInput(activeAppointment.diagnosis || '')
      setTreatmentNoteInput(activeAppointment.treatmentNote || '')
      setShowSaveDot(false)
    }
  }, [activeAppointmentId])

  // Custom auto-save simulation
  useEffect(() => {
    if (!activeAppointment) return
    const delayDebounce = setTimeout(() => {
      if (diagnosisInput !== (activeAppointment.diagnosis || '') || 
          treatmentNoteInput !== (activeAppointment.treatmentNote || '')) {
        setIsSaving(true)
        // Simulate autosave
        setTimeout(() => {
          setIsSaving(false)
          setShowSaveDot(true)
          // Save in state
          activeAppointment.diagnosis = diagnosisInput
          activeAppointment.treatmentNote = treatmentNoteInput
        }, 800)
      }
    }, 1000)

    return () => clearTimeout(delayDebounce)
  }, [diagnosisInput, treatmentNoteInput])

  // Custom window event listener to show a toast message when checkout action is dispatched
  const [checkoutNotification, setCheckoutNotification] = useState<{
    id: string
    patientName: string
    amount: number
  } | null>(null)

  useEffect(() => {
    const handleCheckoutEvent = (e: Event) => {
      const customEvent = e as CustomEvent
      const { appointment } = customEvent.detail
      const totalAmount = appointment.completedCodes.reduce((sum: number, c: DentalCode) => sum + c.price, 0)
      const discount = totalAmount > 500 ? totalAmount * 0.05 : 0
      const finalAmount = totalAmount - discount

      setCheckoutNotification({
        id: appointment.id,
        patientName: appointment.patientName,
        amount: finalAmount
      })

      // Auto-hide notification toast
      setTimeout(() => {
        setCheckoutNotification(null)
      }, 5000)
    }

    window.addEventListener('denthub-checkout-dispatch', handleCheckoutEvent)
    return () => window.removeEventListener('denthub-checkout-dispatch', handleCheckoutEvent)
  }, [])

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          apt.complaint.toLowerCase().includes(searchQuery.toLowerCase())
    if (filterStatus === 'ALL') return matchesSearch
    return apt.status === filterStatus && matchesSearch
  })

  // Get dynamic upcoming summary
  const upcomingCount = appointments.filter(a => a.status === 'CONFIRMED').length
  const pendingCount = appointments.filter(a => a.status === 'REQUESTED').length
  const completedCount = appointments.filter(a => a.status === 'COMPLETED').length

  return (
    <div className="min-h-screen pb-32 pt-6 px-4 md:px-8 max-w-7xl mx-auto flex flex-col gap-6 relative select-none">
      
      {/* GLOBAL DISPATCH NOTIFICATION TOAST */}
      <AnimatePresence>
        {checkoutNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 glass-panel-dark text-white px-5 py-4 rounded-2xl shadow-xl max-w-sm flex flex-col gap-2 border border-emerald-500/30"
          >
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">Checkout Dispatch Successful</span>
            </div>
            <div className="text-sm font-semibold">
              Dispatched telemetry for {checkoutNotification.patientName}
            </div>
            <div className="text-[11px] text-zinc-400">
              Transaction finalized at <span className="font-bold text-zinc-300">${checkoutNotification.amount.toFixed(2)}</span>. Sibling administration components notified.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DASHBOARD HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-zinc-200/50">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900">Good morning, Doctor</h1>
            <div className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
          </div>
          <p className="text-zinc-400 text-xs mt-0.5 font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Senin, 18 Mei 2026 • Asia/Jakarta</span>
          </p>
        </div>

        {/* STATUS BADGES */}
        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-1.5 bg-zinc-100 border border-zinc-200 text-zinc-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>{upcomingCount} upcoming</span>
          </div>
          <div className="px-3.5 py-1.5 bg-zinc-100 border border-zinc-200 text-zinc-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>{pendingCount} pending</span>
          </div>
          <div className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{completedCount} completed</span>
          </div>
        </div>
      </header>

      {/* DASHBOARD GRID CONTENT */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-2">
        
        {/* LEFT COLUMN: TIMELINE APPOINTMENTS (CENTER STAGE) */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-base font-bold text-zinc-800">Appointment Timeline</h2>
              <span className="text-[11px] text-zinc-400">Flow vertical patient queue</span>
            </div>
            
            {/* Filter Pill Tabs */}
            <div className="flex bg-zinc-100 p-0.5 rounded-xl border border-zinc-200/50 shadow-2xs">
              {(['ALL', 'CONFIRMED', 'REQUESTED', 'COMPLETED'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                    filterStatus === status 
                      ? 'bg-white text-zinc-900 shadow-2xs' 
                      : 'text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar inside dashboard */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search patients or symptoms..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/70 border border-zinc-200 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all font-medium placeholder-zinc-400 shadow-3xs"
            />
          </div>

          {/* LIST of Appointment Cards */}
          <div className="space-y-3.5">
            {filteredAppointments.length === 0 ? (
              <div className="glass-panel py-12 px-4 rounded-3xl flex flex-col items-center justify-center text-center">
                <span className="text-zinc-400 text-sm font-semibold">No appointments yet. Enjoy the quiet.</span>
                <span className="text-xs text-zinc-400 mt-1 max-w-xs">Relax or review clinical research materials during downtime.</span>
              </div>
            ) : (
              filteredAppointments.map((apt) => {
                const isActive = apt.id === activeAppointmentId
                const billTotal = apt.completedCodes.reduce((sum, item) => sum + item.price, 0)
                const discount = billTotal > 500 ? billTotal * 0.05 : 0
                const finalBill = billTotal - discount

                return (
                  <motion.div
                    key={apt.id}
                    layoutId={`apt-card-${apt.id}`}
                    onClick={() => setActiveAppointmentId(apt.id)}
                    className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 relative flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isActive 
                        ? 'bg-white border-l-4 border-zinc-900 shadow-md transform translate-x-1' 
                        : 'bg-white/60 border border-zinc-200/50 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Left: Time and Avatar */}
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-sm font-black text-zinc-800 tabular-nums">{apt.time.split(' ')[0]}</span>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase">{apt.time.split(' ')[1]}</span>
                      </div>

                      {/* Middle: Patient details */}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-zinc-800">{apt.patientName}</span>
                          
                          {/* Status Badge */}
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            apt.status === 'COMPLETED' 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                              : apt.status === 'REQUESTED' 
                                ? 'bg-amber-50 text-amber-600 border border-amber-100 animate-pulse' 
                                : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 font-medium line-clamp-1 mt-0.5">{apt.complaint}</p>
                      </div>
                    </div>

                    {/* Right: Code count or action summary */}
                    <div className="flex items-center gap-3.5 self-end md:self-center">
                      {apt.completedCodes.length > 0 && (
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-zinc-400 font-medium">{apt.completedCodes.length} codes</span>
                          <span className="text-sm font-bold text-zinc-900">${finalBill.toFixed(2)}</span>
                        </div>
                      )}

                      {/* Status actions / Quick Approve for Requested */}
                      {apt.status === 'REQUESTED' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateAppointmentStatus(apt.id, 'CONFIRMED')
                          }}
                          className="px-3 py-1.5 text-[10px] font-bold bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-colors flex items-center gap-1 shadow-3xs"
                        >
                          <Check className="w-3 h-3" />
                          <span>Confirm</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: MORPHING PATIENT DETAIL PANEL & NOTES */}
        <section className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {activeAppointment ? (
              <motion.div
                key={activeAppointment.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="glass-panel p-6 rounded-3xl shadow-xl space-y-6 border border-white/50"
              >
                {/* Panel Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-900 text-white rounded-2xl flex items-center justify-center font-bold text-sm">
                      {activeAppointment.patientName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-zinc-900">{activeAppointment.patientName}</h3>
                      <p className="text-[10px] text-zinc-400 font-medium">Active Treatment Dashboard</p>
                    </div>
                  </div>
                  
                  {/* Status & Save micro-dot */}
                  <div className="flex items-center gap-2">
                    <AnimatePresence>
                      {isSaving && (
                        <motion.span 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="text-[10px] text-zinc-400 font-semibold italic flex items-center gap-1"
                        >
                          Saving...
                        </motion.span>
                      )}
                    </AnimatePresence>
                    
                    {showSaveDot && !isSaving && (
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" title="Autosaved successfully" />
                    )}

                    <span className="text-xs text-zinc-400 font-semibold tabular-nums">{activeAppointment.time}</span>
                  </div>
                </div>

                {/* Complaint Banner */}
                <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Chief Complaint</span>
                  <p className="text-xs text-zinc-600 font-medium mt-0.5">{activeAppointment.complaint}</p>
                </div>

                {/* VISIT NOTES FORM (ULTRA MINIMAL) */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-zinc-400" />
                    <span>Clinical Visit Notes</span>
                  </h4>
                  
                  {/* Diagnosis field */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Diagnosis / Assessment</label>
                    <textarea
                      placeholder="Type primary diagnosis..."
                      value={diagnosisInput}
                      onChange={e => setDiagnosisInput(e.target.value)}
                      rows={2}
                      className="w-full p-3 bg-white/80 border border-zinc-200/80 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all font-medium"
                    />
                  </div>

                  {/* Treatment Notes field */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Treatment plan & recommendations</label>
                    <textarea
                      placeholder="Type clinical recommendations..."
                      value={treatmentNoteInput}
                      onChange={e => setTreatmentNoteInput(e.target.value)}
                      rows={2}
                      className="w-full p-3 bg-white/80 border border-zinc-200/80 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* INTERACTIVE COMPLETED DENTAL CODES SELECTION */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                      <span>Treatment Codes Completed</span>
                    </h4>
                    <span className="text-[10px] text-zinc-400 font-medium">Click to mark completed</span>
                  </div>

                  {/* Quick-add grids */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {DENTAL_CODES_DB.map((dentalCode) => {
                      const isCompleted = activeAppointment.completedCodes.some(c => c.code === dentalCode.code)

                      return (
                        <button
                          key={dentalCode.code}
                          onClick={() => {
                            if (isCompleted) {
                              removeTreatmentCode(activeAppointment.id, dentalCode.code)
                            } else {
                              completeTreatmentCode(activeAppointment.id, dentalCode)
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between gap-2 ${
                            isCompleted 
                              ? 'bg-emerald-50/50 border-emerald-300/60 shadow-2xs' 
                              : 'bg-white/80 border-zinc-200/60 hover:border-zinc-300'
                          }`}
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-bold text-zinc-500">{dentalCode.code}</span>
                            <span className="text-xs font-bold text-zinc-700 truncate">{dentalCode.name}</span>
                            <span className="text-[9px] text-zinc-400 mt-0.5">${dentalCode.price.toFixed(2)}</span>
                          </div>
                          
                          {/* Check Indicator */}
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                            isCompleted 
                              ? 'bg-emerald-500 border-emerald-500 text-white' 
                              : 'border-zinc-300'
                          }`}>
                            {isCompleted && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Transition State Button: Done with visit, trigger checkout */}
                <div className="pt-2">
                  <button
                    disabled={activeAppointment.completedCodes.length === 0}
                    onClick={() => checkoutAppointment(activeAppointment.id)}
                    className="w-full py-3.5 px-4 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-400 text-white font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Complete Treatment & Dispatch Checkout</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="glass-panel p-12 text-center text-zinc-400 rounded-3xl">
                <span>Select a patient from the timeline to manage clinical notes and billing codes.</span>
              </div>
            )}
          </AnimatePresence>
        </section>

      </main>

      {/* BILLING SHEET BOTTOM SHEET OVERLAY */}
      <BillingOverlay />

    </div>
  )
}

export default function App() {
  return (
    <BillingStateProvider>
      <Dashboard />
    </BillingStateProvider>
  )
}
