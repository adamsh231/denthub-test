import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown, ChevronUp, Users, Info, ShieldAlert, Sparkles, Plus, Minus } from "lucide-react";

// 7-day initial mock calendar data (privacy-first: no PII)
const INITIAL_WEEK_DATA = [
  {
    id: "day-1",
    dayName: "Mon",
    dayNum: "18",
    fullDate: "Mon, May 18",
    isToday: true,
    categories: {
      consultations: 3,
      procedures: 1,
      emergencies: 0,
      checkups: 2
    }
  },
  {
    id: "day-2",
    dayName: "Tue",
    dayNum: "19",
    fullDate: "Tue, May 19",
    isToday: false,
    categories: {
      consultations: 1,
      procedures: 2,
      emergencies: 1,
      checkups: 0
    }
  },
  {
    id: "day-3",
    dayName: "Wed",
    dayNum: "20",
    fullDate: "Wed, May 20",
    isToday: false,
    categories: {
      consultations: 4,
      procedures: 0,
      emergencies: 0,
      checkups: 3
    }
  },
  {
    id: "day-4",
    dayName: "Thu",
    dayNum: "21",
    fullDate: "Thu, May 21",
    isToday: false,
    categories: {
      consultations: 2,
      procedures: 1,
      emergencies: 2,
      checkups: 1
    }
  },
  {
    id: "day-5",
    dayName: "Fri",
    dayNum: "22",
    fullDate: "Fri, May 22",
    isToday: false,
    categories: {
      consultations: 0,
      procedures: 0,
      emergencies: 0,
      checkups: 1
    }
  },
  {
    id: "day-6",
    dayName: "Sat",
    dayNum: "23",
    fullDate: "Sat, May 23",
    isToday: false,
    categories: {
      consultations: 2,
      procedures: 3,
      emergencies: 0,
      checkups: 0
    }
  },
  {
    id: "day-7",
    dayName: "Sun",
    dayNum: "24",
    fullDate: "Sun, May 24",
    isToday: false,
    categories: {
      consultations: 0,
      procedures: 0,
      emergencies: 0,
      checkups: 0
    }
  }
];

// Helper to get total daily volume
const getTotalVolume = (categories) => {
  return Object.values(categories).reduce((sum, val) => sum + val, 0);
};

// Volume-based coloring system using a clean violet/indigo gradient representing density
const getDensityStyles = (volume) => {
  if (volume === 0) {
    return {
      bg: "bg-gray-100/60 dark:bg-gray-800/40 text-gray-400",
      border: "border-gray-200/50",
      indicator: "bg-gray-300",
      label: "Quiet"
    };
  }
  if (volume <= 2) {
    return {
      bg: "bg-violet-50 text-violet-700 border-violet-100",
      border: "border-violet-100",
      indicator: "bg-violet-400",
      label: "Light"
    };
  }
  if (volume <= 4) {
    return {
      bg: "bg-violet-200 text-violet-900 border-violet-300",
      border: "border-violet-300",
      indicator: "bg-violet-600",
      label: "Moderate"
    };
  }
  if (volume <= 6) {
    return {
      bg: "bg-violet-500 text-white border-violet-600",
      border: "border-violet-600",
      indicator: "bg-white",
      label: "Busy"
    };
  }
  return {
    bg: "bg-violet-700 text-white border-violet-850 shadow-sm shadow-violet-700/20",
    border: "border-violet-800",
    indicator: "bg-violet-200",
    label: "Peak"
  };
};

export default function WeeklyOverviewRibbon({ onLogAction }) {
  const [weekData, setWeekData] = useState(INITIAL_WEEK_DATA);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState("day-1");

  // Toggle expand/collapse state
  const handleToggle = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    if (onLogAction) {
      onLogAction(
        nextState 
          ? "Expanded Weekly Overview ribbon (Accordion Unfolded)" 
          : "Collapsed Weekly Overview ribbon (Accordion Folded)"
      );
    }
  };

  // Adjust mock data to show dynamic gradient colors in real time
  const modifyVolume = (dayId, category, delta) => {
    setWeekData((prev) =>
      prev.map((day) => {
        if (day.id === dayId) {
          const newVal = Math.max(0, day.categories[category] + delta);
          const updatedDay = {
            ...day,
            categories: {
              ...day.categories,
              [category]: newVal
            }
          };
          if (onLogAction) {
            onLogAction(
              `Updated ${day.fullDate} ${category} density to ${newVal}. Total volume: ${getTotalVolume(updatedDay.categories)}`
            );
          }
          return updatedDay;
        }
        return day;
      })
    );
  };

  // Drag swipe gesture handlers using Framer Motion drag gestures
  const handleDragEnd = (event, info) => {
    // If user swiped down (offsetY > 40) while collapsed, expand it
    // If user swiped up (offsetY < -40) while expanded, collapse it
    const swipeThreshold = 35;
    if (!isExpanded && info.offset.y > swipeThreshold) {
      setIsExpanded(true);
      if (onLogAction) onLogAction("Weekly Overview swiped down (Expanded)");
    } else if (isExpanded && info.offset.y < -swipeThreshold) {
      setIsExpanded(false);
      if (onLogAction) onLogAction("Weekly Overview swiped up (Collapsed)");
    }
  };

  const activeDayData = weekData.find((d) => d.id === selectedDayId) || weekData[0];
  const activeDayTotal = getTotalVolume(activeDayData.categories);

  // Smooth custom easing curve for the accordion unfold transition (EaseOutExpo curve)
  const transitionConfig = {
    type: "spring",
    stiffness: 280,
    damping: 30,
    mass: 0.8,
    ease: [0.16, 1, 0.3, 1] // Custom ease curve fallback
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 font-sans">
      {/* Privacy-first badge indicator */}
      <div className="flex items-center justify-between px-3 py-1 mb-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">
          <Calendar className="w-3.5 h-3.5 text-violet-500" />
          <span>Weekly Ribbon Overview</span>
        </div>
        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight border border-emerald-100">
          <span>Privacy-First</span>
        </div>
      </div>

      {/* Main Accordion Container */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={{
          height: isExpanded ? "auto" : "78px",
        }}
        transition={transitionConfig}
        className="glass-card w-full rounded-2xl md:rounded-3xl shadow-sm border border-gray-150 overflow-hidden select-none cursor-grab active:cursor-grabbing"
      >
        <div className="p-3 md:p-4 flex flex-col justify-start h-full">
          {/* HEADER TRIGGER LINE */}
          <div 
            onClick={handleToggle}
            className="flex items-center justify-between cursor-pointer py-1"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-600 animate-pulse" />
              <span className="text-xs font-extrabold text-gray-700">
                {isExpanded ? "Interactive Visual Density Summary" : "Weekly Flow Density Ribbon"}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-violet-600 font-bold bg-violet-50 px-2.5 py-1 rounded-lg hover:bg-violet-100 transition-colors">
              <span>{isExpanded ? "Collapse View" : "Expand Density Details"}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </div>

          {/* 7-DAY HORIZONTAL FLEXBOX RIBBON */}
          <div className="mt-3 flex items-stretch justify-between gap-1.5 md:gap-3 w-full">
            {weekData.map((day) => {
              const totalVol = getTotalVolume(day.categories);
              const density = getDensityStyles(totalVol);
              const isSelected = selectedDayId === day.id;

              return (
                <div
                  key={day.id}
                  onClick={() => {
                    setSelectedDayId(day.id);
                    if (!isExpanded) {
                      setIsExpanded(true);
                      if (onLogAction) onLogAction(`Tapped ${day.fullDate} to expand and view density breakdown.`);
                    } else if (onLogAction) {
                      onLogAction(`Selected ${day.fullDate} to view density details.`);
                    }
                  }}
                  className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300 cursor-pointer relative border ${
                    isSelected && isExpanded 
                      ? "ring-2 ring-violet-600 ring-offset-2 scale-[1.02]" 
                      : "hover:scale-[1.01]"
                  } ${day.isToday ? "border-amber-400" : density.border} ${density.bg}`}
                  style={density.style || {}}
                >
                  {/* Highlight bar for today */}
                  {day.isToday && (
                    <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 bg-amber-400 text-[8px] px-1 font-extrabold text-white rounded-full uppercase tracking-tighter shadow-sm">
                      Today
                    </span>
                  )}

                  {/* Day Letter / Date */}
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-90">
                    {day.dayName}
                  </span>
                  <span className="text-sm md:text-lg font-black tracking-tight leading-none mt-0.5">
                    {day.dayNum}
                  </span>

                  {/* Micro indicator representing volume gradient */}
                  <div className="mt-1 flex items-center justify-center gap-0.5">
                    {totalVol === 0 ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 opacity-60" />
                    ) : (
                      Array.from({ length: Math.min(3, totalVol) }).map((_, idx) => (
                        <span 
                          key={idx} 
                          className={`w-1 h-1 rounded-full ${
                            totalVol > 4 ? "bg-white" : "bg-violet-600"
                          }`} 
                        />
                      ))
                    )}
                    {totalVol > 3 && (
                      <span className={`text-[7px] font-black ${totalVol > 4 ? "text-white" : "text-violet-700"}`}>
                        +
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ACCORDION UNFOLDED DETAILS (ZERO-PII CATEGORY METRICS) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={transitionConfig}
                className="mt-4 border-t border-gray-100 pt-4 w-full"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  
                  {/* Selected Day Stats (Columns 1-4) */}
                  <div className="md:col-span-4 bg-gray-50/70 p-3 rounded-2xl border border-gray-100/80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">
                        Selected Density
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        activeDayTotal > 4 
                          ? "bg-violet-600 text-white" 
                          : activeDayTotal > 0 
                          ? "bg-violet-100 text-violet-700" 
                          : "bg-gray-150 text-gray-600"
                      }`}>
                        {getDensityStyles(activeDayTotal).label} Flow
                      </span>
                    </div>
                    <div className="text-xl font-black text-gray-800 tracking-tight">
                      {activeDayData.fullDate}
                    </div>
                    <div className="text-xs text-gray-500 font-semibold mt-1">
                      Total Daily Volume:{" "}
                      <span className="text-violet-600 font-extrabold text-sm">{activeDayTotal} Appointments</span>
                    </div>

                    <div className="mt-3 flex items-center gap-2 p-2 bg-blue-50 border border-blue-100 rounded-xl">
                      <ShieldAlert className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <p className="text-[10px] text-blue-800 font-semibold leading-snug">
                        Zero patient names are visible here. HIPAA & privacy compliant layout density models.
                      </p>
                    </div>
                  </div>

                  {/* Category Grid Blocks (Columns 5-12) */}
                  <div className="md:col-span-8">
                    <div className="mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between">
                      <span>Generalized Category Breakdown</span>
                      <span className="text-[10px] font-semibold text-gray-500 italic">No Private Identifiers (PII)</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      
                      {/* CONSULTATIONS */}
                      <div className="bg-white border border-gray-100 p-2.5 rounded-xl shadow-xs flex flex-col justify-between">
                        <div className="text-[10px] font-bold text-gray-400 uppercase">Consultations</div>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-lg font-black text-violet-600">
                            {activeDayData.categories.consultations}
                          </span>
                          <div className="flex gap-0.5">
                            <button
                              onClick={() => modifyVolume(selectedDayId, "consultations", -1)}
                              className="w-5 h-5 flex items-center justify-center bg-gray-100 hover:bg-gray-200 active:scale-90 rounded text-gray-600 text-xs font-bold transition-all"
                            >
                              -
                            </button>
                            <button
                              onClick={() => modifyVolume(selectedDayId, "consultations", 1)}
                              className="w-5 h-5 flex items-center justify-center bg-violet-100 hover:bg-violet-200 active:scale-90 rounded text-violet-600 text-xs font-bold transition-all"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* PROCEDURES */}
                      <div className="bg-white border border-gray-100 p-2.5 rounded-xl shadow-xs flex flex-col justify-between">
                        <div className="text-[10px] font-bold text-gray-400 uppercase">Procedures</div>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-lg font-black text-amber-600">
                            {activeDayData.categories.procedures}
                          </span>
                          <div className="flex gap-0.5">
                            <button
                              onClick={() => modifyVolume(selectedDayId, "procedures", -1)}
                              className="w-5 h-5 flex items-center justify-center bg-gray-100 hover:bg-gray-200 active:scale-90 rounded text-gray-600 text-xs font-bold transition-all"
                            >
                              -
                            </button>
                            <button
                              onClick={() => modifyVolume(selectedDayId, "procedures", 1)}
                              className="w-5 h-5 flex items-center justify-center bg-amber-100 hover:bg-amber-200 active:scale-90 rounded text-amber-600 text-xs font-bold transition-all"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* CHECKUPS */}
                      <div className="bg-white border border-gray-100 p-2.5 rounded-xl shadow-xs flex flex-col justify-between">
                        <div className="text-[10px] font-bold text-gray-400 uppercase">Checkups</div>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-lg font-black text-emerald-600">
                            {activeDayData.categories.checkups}
                          </span>
                          <div className="flex gap-0.5">
                            <button
                              onClick={() => modifyVolume(selectedDayId, "checkups", -1)}
                              className="w-5 h-5 flex items-center justify-center bg-gray-100 hover:bg-gray-200 active:scale-90 rounded text-gray-600 text-xs font-bold transition-all"
                            >
                              -
                            </button>
                            <button
                              onClick={() => modifyVolume(selectedDayId, "checkups", 1)}
                              className="w-5 h-5 flex items-center justify-center bg-emerald-100 hover:bg-emerald-200 active:scale-90 rounded text-emerald-600 text-xs font-bold transition-all"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* EMERGENCIES */}
                      <div className="bg-white border border-gray-100 p-2.5 rounded-xl shadow-xs flex flex-col justify-between">
                        <div className="text-[10px] font-bold text-gray-400 uppercase">Emergencies</div>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-lg font-black text-rose-600">
                            {activeDayData.categories.emergencies}
                          </span>
                          <div className="flex gap-0.5">
                            <button
                              onClick={() => modifyVolume(selectedDayId, "emergencies", -1)}
                              className="w-5 h-5 flex items-center justify-center bg-gray-100 hover:bg-gray-200 active:scale-90 rounded text-gray-600 text-xs font-bold transition-all"
                            >
                              -
                            </button>
                            <button
                              onClick={() => modifyVolume(selectedDayId, "emergencies", 1)}
                              className="w-5 h-5 flex items-center justify-center bg-rose-100 hover:bg-rose-200 active:scale-90 rounded text-rose-600 text-xs font-bold transition-all"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Interactive Simulated Flow Density Tip */}
                    <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400 font-semibold bg-gray-50 p-2 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-violet-500" />
                        <span>Try tapping + or - to modify density and see the colored gradient update in real-time!</span>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Swipe indicator drag bar handle */}
          <div className="mt-2.5 flex justify-center items-center w-full opacity-60">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}