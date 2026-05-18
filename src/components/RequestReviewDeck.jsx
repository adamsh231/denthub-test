import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useDragControls
} from "framer-motion";
import { Check, X, Calendar, Clock, ChevronDown, RefreshCw, Sparkles, Send, CornerDownLeft, AlertCircle } from "lucide-react";

// Standard Spring Physics for tactile response
const CARD_SPRING = {
  type: "spring",
  stiffness: 400,
  damping: 28,
  mass: 1
};

export default function RequestReviewDeck({
  requests: initialRequests = [],
  onApprove = () => {},
  onReject = () => {}
}) {
  const [requests, setRequests] = useState(initialRequests);
  const [activeId, setActiveId] = useState(null);
  
  // Set the top card ID
  useEffect(() => {
    if (requests.length > 0) {
      setActiveId(requests[0].id);
    } else {
      setActiveId(null);
    }
  }, [requests]);

  const handleApprove = (id) => {
    onApprove(id);
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleReject = (id, reason) => {
    onReject(id, reason);
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="relative w-full max-w-md mx-auto h-[480px] flex items-center justify-center select-none">
      <AnimatePresence mode="popLayout">
        {requests.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={CARD_SPRING}
            className="flex flex-col items-center justify-center p-8 text-center text-gray-400"
          >
            <Sparkles className="w-10 h-10 mb-3 text-violet-400/60 animate-pulse" />
            <h3 className="text-xl font-medium text-gray-800">All caught up!</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-xs">
              No appointments yet. Enjoy the quiet.
            </p>
          </motion.div>
        ) : (
          requests
            .slice(0, 3) // Only render the top 3 cards for memory and performance
            .reverse() // Reverse so the top card (index 0) is rendered last (on top of others)
            .map((request, index, arr) => {
              // The top card is the last one in the sliced and reversed list
              const isTop = request.id === activeId;
              const stackIndex = arr.length - 1 - index; // 0 for top, 1 for second, 2 for third

              return (
                <ReviewCard
                  key={request.id}
                  request={request}
                  isTop={isTop}
                  stackIndex={stackIndex}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              );
            })
        )}
      </AnimatePresence>
    </div>
  );
}

function ReviewCard({ request, isTop, stackIndex, onApprove, onReject }) {
  const [locked, setLocked] = useState(false);
  const [reason, setReason] = useState("");
  const textareaRef = useRef(null);

  // Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transforms for gestural visual response
  const rotate = useTransform(x, [-150, 150], [-8, 8]);
  const opacity = useTransform(x, [-150, -100, 0, 100, 150], [0.5, 0.9, 1, 0.9, 0.5]);

  // Visual cues based on swipe/drag location
  const approveOpacity = useTransform(x, [0, 80], [0, 1]);
  const rejectOpacity = useTransform(y, [0, 80], [0, 1]);

  // Adjust card scaling/stacking offsets
  const scale = 1 - stackIndex * 0.04;
  const translateY = stackIndex * 14;

  const dragControls = useDragControls();

  // Focus the input when locked (reject input revealed)
  useEffect(() => {
    if (locked) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [locked]);

  // Handle Drag End event
  const handleDragEnd = (event, info) => {
    if (locked) return;

    const dragX = info.offset.x;
    const dragY = info.offset.y;

    if (dragX > 140) {
      // Swipe Right -> Approve!
      onApprove(request.id);
    } else if (dragY > 110) {
      // Drag Down -> Trigger Locked Reject State!
      setLocked(true);
    } else {
      // Snapback!
      x.set(0);
      y.set(0);
    }
  };

  const handleCancelReject = () => {
    // Snapback to center
    setLocked(false);
    setReason("");
    x.set(0);
    y.set(0);
  };

  const handleSubmitReject = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onReject(request.id, reason);
  };

  return (
    <motion.div
      style={{
        x: locked ? 0 : x,
        y: locked ? 120 : y,
        rotate: locked ? 0 : rotate,
        opacity: locked ? 1 : opacity,
        zIndex: 100 - stackIndex,
        transformOrigin: "bottom center"
      }}
      initial={{
        opacity: 0,
        y: -100,
        scale: 0.9
      }}
      animate={{
        opacity: 1,
        y: locked ? 120 : translateY,
        scale: locked ? 1.02 : scale,
        transition: CARD_SPRING
      }}
      exit={
        locked
          ? {
              y: 600,
              opacity: 0,
              scale: 0.95,
              transition: { duration: 0.35, ease: "easeIn" }
            }
          : {
              x: x.get() > 0 ? 500 : -500,
              opacity: 0,
              scale: 0.9,
              transition: { duration: 0.35, ease: "easeOut" }
            }
      }
      drag={isTop && !locked ? "both" : false}
      dragConstraints={{ left: -180, right: 200, top: -40, bottom: 200 }}
      dragElastic={0.4}
      onDragEnd={handleDragEnd}
      className={`absolute w-full max-w-sm glass-card rounded-3xl p-6 select-none cursor-grab active:cursor-grabbing ${
        isTop ? "shadow-xl border-gray-100" : "shadow-md border-gray-100/50 pointer-events-none"
      }`}
    >
      {/* APPROVAL OVERLAY CUE */}
      {!locked && isTop && (
        <motion.div
          style={{ opacity: approveOpacity }}
          className="absolute inset-0 bg-emerald-500/10 rounded-3xl pointer-events-none border border-emerald-500/30 flex items-center justify-center"
        >
          <div className="bg-emerald-500 text-white rounded-full p-4 shadow-lg scale-110 flex items-center justify-center">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>
        </motion.div>
      )}

      {/* REJECTION OVERLAY CUE (Pre-threshold indicator) */}
      {!locked && isTop && (
        <motion.div
          style={{ opacity: rejectOpacity }}
          className="absolute inset-0 bg-rose-500/10 rounded-3xl pointer-events-none border border-rose-500/30 flex items-end justify-center pb-8"
        >
          <div className="bg-rose-500 text-white rounded-full p-4 shadow-lg scale-110 flex items-center justify-center">
            <X className="w-8 h-8 stroke-[3]" />
          </div>
        </motion.div>
      )}

      {/* CARD CONTENT */}
      <div className={`transition-all duration-300 ${locked ? "opacity-30 pointer-events-none filter blur-[1px]" : "opacity-100"}`}>
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-600 border border-violet-100 uppercase tracking-wider">
              {request.type}
            </span>
          </div>
          <div className="text-right">
            <h4 className="text-xl font-bold text-gray-900">{request.time}</h4>
            <p className="text-xs text-gray-500">{request.date}</p>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-2xl font-extrabold text-gray-900 leading-tight tracking-tight">
            {request.patientName}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{request.patientDetails}</p>
        </div>

        <div className="mt-6 bg-gray-50/80 rounded-2xl p-4 border border-gray-100/50">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Chief Complaint</p>
          <p className="text-sm text-gray-700 font-medium mt-1 italic">
            "{request.complaint}"
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between text-xs text-gray-400 font-medium">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            Requested {request.requestedAgo}
          </span>
          {isTop && (
            <span className="flex items-center gap-1 text-violet-400/90 font-semibold animate-pulse">
              Drag Right to Approve • Down to Reject
            </span>
          )}
        </div>
      </div>

      {/* INLINE REJECTION TEXTAREA FORM (revealed when locked) */}
      <AnimatePresence>
        {locked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-white/95 rounded-3xl p-6 flex flex-col justify-between shadow-inner border border-rose-100"
          >
            <form onSubmit={handleSubmitReject} className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-rose-600 mb-3">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-wider">Provide Rejection Feedback</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Let <span className="font-semibold text-gray-700">{request.patientName}</span> know why their request cannot be accommodated.
                </p>
                <textarea
                  ref={textareaRef}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Schedule conflict. Let's reschedule for next Tuesday morning?"
                  className="w-full h-24 p-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 resize-none placeholder-gray-400 transition-all duration-200"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleCancelReject}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!reason.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send & Reject
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
