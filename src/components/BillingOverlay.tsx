import React, { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { useBillingState } from '../context/BillingStateContext'
import { 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  CreditCard, 
  CheckCircle2, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react'

export const BillingOverlay: React.FC = () => {
  const { 
    activeAppointment, 
    removeTreatmentCode,
    checkoutAppointment,
    lastCompletedCode,
    clearLastCompletedCode
  } = useBillingState()

  const [isOpen, setIsOpen] = useState(false)
  const [isPeekActive, setIsPeekActive] = useState(false)
  const [justCheckedOut, setJustCheckedOut] = useState(false)

  // Track the most recent code that triggered a peek
  const [peekingCode, setPeekingCode] = useState<string | null>(null)

  // Handle auto-peek behavior when a new code is completed
  useEffect(() => {
    if (lastCompletedCode && activeAppointment && lastCompletedCode.appointmentId === activeAppointment.id) {
      setPeekingCode(lastCompletedCode.code)
      setIsPeekActive(true)
      
      // Auto-hide the extra peek prompt after 4 seconds
      const timer = setTimeout(() => {
        setIsPeekActive(false)
        setPeekingCode(null)
        clearLastCompletedCode()
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [lastCompletedCode, activeAppointment, clearLastCompletedCode])

  if (!activeAppointment) return null

  const completedCodes = activeAppointment.completedCodes
  const totalAmount = completedCodes.reduce((sum, item) => sum + item.price, 0)
  const discount = totalAmount > 500 ? totalAmount * 0.05 : 0 // 5% discount for bills above $500
  const finalAmount = totalAmount - discount

  const handleCheckout = () => {
    checkoutAppointment(activeAppointment.id)
    setJustCheckedOut(true)
    setIsPeekActive(false)
    setTimeout(() => {
      setJustCheckedOut(false)
      setIsOpen(false)
    }, 2500)
  }

  // Animation variants for the bottom panel container
  const panelVariants = {
    collapsed: {
      y: 'calc(100% - 90px)',
      transition: { type: 'spring', stiffness: 280, damping: 30 } as any
    },
    peeking: {
      y: 'calc(100% - 150px)',
      transition: { type: 'spring', stiffness: 400, damping: 25 } as any
    },
    expanded: {
      y: 0,
      transition: { type: 'spring', stiffness: 260, damping: 28 } as any
    }
  }

  return (
    <>
      {/* Bottom Floating Bar & Dialog Root */}
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <AnimatePresence>
          {isOpen && (
            <Dialog.Overlay asChild>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/10 backdrop-blur-xs z-40 transition-all duration-300"
              />
            </Dialog.Overlay>
          )}
        </AnimatePresence>

        {/* The Bottom Sheet Body */}
        <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pointer-events-none">
          <motion.div
            variants={panelVariants}
            initial="collapsed"
            animate={
              justCheckedOut 
                ? "expanded" 
                : isOpen 
                  ? "expanded" 
                  : isPeekActive 
                    ? "peeking" 
                    : "collapsed"
            }
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.1, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) {
                setIsOpen(false)
                setIsPeekActive(false)
              } else if (info.offset.y < -60) {
                setIsOpen(true)
              }
            }}
            className="w-full max-w-xl glass-panel shadow-2xl rounded-t-3xl overflow-hidden border-t border-white/60 pointer-events-auto flex flex-col max-h-[85vh] origin-bottom select-none"
          >
            {/* DRAG HANDLE BAR */}
            <div 
              onClick={() => setIsOpen(!isOpen)}
              className="w-full py-3 flex flex-col items-center cursor-pointer hover:bg-white/30 active:bg-white/40 transition-colors duration-200"
            >
              <div className="w-12 h-1.5 rounded-full bg-zinc-300/80 mb-2 transition-colors group-hover:bg-zinc-400" />
              
              {/* Conditional Peek Status Notification */}
              <AnimatePresence mode="wait">
                {isPeekActive && peekingCode ? (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center gap-1.5 text-emerald-600 font-medium text-xs px-2.5 py-0.5 bg-emerald-50 rounded-full border border-emerald-100 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>Added {peekingCode} • +${activeAppointment.completedCodes.find(c => c.code === peekingCode)?.price}</span>
                  </motion.div>
                ) : justCheckedOut ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1.5 text-emerald-600 font-medium text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 animate-bounce" />
                    <span>Checkout Complete!</span>
                  </motion.div>
                ) : (
                  <motion.span 
                    key="billing-estimate-lbl"
                    className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold"
                  >
                    Billing Estimate Panel
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* PEEKING / COLLAPSED HEADER INFO */}
            <div className="px-6 pb-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-zinc-400 text-xs font-medium">Patient Bill ({activeAppointment.patientName})</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-bold text-zinc-900">${finalAmount.toFixed(2)}</span>
                  {discount > 0 && (
                    <span className="text-xs text-zinc-400 line-through">${totalAmount.toFixed(2)}</span>
                  )}
                  {completedCodes.length > 0 && (
                    <span className="text-[11px] px-2 py-0.5 bg-zinc-100 border border-zinc-200 text-zinc-600 font-medium rounded-full ml-1">
                      {completedCodes.length} {completedCodes.length === 1 ? 'item' : 'items'}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isOpen ? (
                  <>
                    <button
                      onClick={() => setIsOpen(true)}
                      className="px-3.5 py-2 text-xs font-semibold text-zinc-700 bg-white/80 hover:bg-white rounded-full transition-all border border-zinc-200 shadow-sm flex items-center gap-1"
                    >
                      <span>Breakdown</span>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={completedCodes.length === 0}
                      onClick={handleCheckout}
                      className="px-4 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400 rounded-full transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Checkout</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-all"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* EXPANDED CONTENT WRAPPER */}
            <div className="flex-1 overflow-y-auto px-6 py-2 border-t border-zinc-100 bg-white/25">
              <AnimatePresence>
                {justCheckedOut ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-500 border border-emerald-100 shadow-sm">
                      <CheckCircle2 className="w-10 h-10 animate-pulse" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900">Payment Processed</h3>
                    <p className="text-sm text-zinc-500 max-w-xs mt-1">
                      Billing receipt for {activeAppointment.patientName} has been synchronized and dispatched.
                    </p>
                  </motion.div>
                ) : completedCodes.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-zinc-400 text-center"
                  >
                    <Layers className="w-8 h-8 stroke-1 mb-2 text-zinc-300" />
                    <span className="text-xs font-medium">No dental codes completed yet.</span>
                    <span className="text-[10px] text-zinc-400 mt-0.5">Mark items completed on the timeline to add them here.</span>
                  </motion.div>
                ) : (
                  <div className="space-y-4 py-4">
                    {/* Itemized list */}
                    <div className="space-y-2">
                      <h4 className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-2">Itemized Treatments</h4>
                      <AnimatePresence mode="popLayout">
                        {completedCodes.map((item) => (
                          <motion.div
                            key={item.code}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                            className="flex items-center justify-between p-3 bg-white/60 border border-white/80 rounded-2xl shadow-xs group/item hover:border-zinc-200 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="px-2 py-1 bg-zinc-100 rounded-lg text-[10px] font-bold text-zinc-500 border border-zinc-200">
                                {item.code}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-zinc-800 line-clamp-1">{item.name}</span>
                                <span className="text-[10px] text-zinc-400 font-medium">{item.category}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-zinc-900">${item.price.toFixed(2)}</span>
                              <button
                                onClick={() => removeTreatmentCode(activeAppointment.id, item.code)}
                                className="p-1.5 text-zinc-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover/item:opacity-100 transition-all duration-200"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Cost Summary Breakdown */}
                    <div className="p-4 bg-zinc-50/70 border border-zinc-100 rounded-2xl space-y-2 mt-4">
                      <div className="flex justify-between text-xs text-zinc-500">
                        <span>Subtotal</span>
                        <span className="font-semibold">${totalAmount.toFixed(2)}</span>
                      </div>
                      
                      {discount > 0 && (
                        <div className="flex justify-between text-xs text-emerald-600 font-medium">
                          <span>Volume Discount (5%)</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-xs text-zinc-500">
                        <span>Tax & Regulatory Fees</span>
                        <span className="font-semibold">$0.00</span>
                      </div>

                      <div className="h-px bg-zinc-200/60 my-2" />

                      <div className="flex justify-between items-baseline">
                        <span className="text-sm font-bold text-zinc-800">Grand Total</span>
                        <span className="text-lg font-black text-zinc-900">${finalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Micro-Interaction Tips */}
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 bg-amber-50/40 border border-amber-100/50 p-2.5 rounded-xl">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Instant checkout dispatches transaction telemetry to checkout specialist.</span>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* ACTION TRIGGERS IN EXPANDED FOOTER */}
            {!justCheckedOut && completedCodes.length > 0 && (
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Total to Settle</span>
                  <span className="text-xl font-bold text-zinc-900">${finalAmount.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="flex-1 max-w-xs py-3.5 px-6 bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Execute Instant Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </Dialog.Root>
    </>
  )
}
