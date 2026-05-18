import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisitNotesStore } from '../store/visitNotesStore';
import type { TreatmentSuggestion } from '../store/visitNotesStore';
import { Sparkles, Activity } from 'lucide-react';

interface SuggestionPillsProps {
  onSelectSuggestion: (suggestion: TreatmentSuggestion) => void;
}

export const SuggestionPills: React.FC<SuggestionPillsProps> = ({ onSelectSuggestion }) => {
  const { suggestions, isDiagnosisFocused } = useVisitNotesStore();

  // Non-intrusive container shown only when there are suggestions
  return (
    <div className="mt-3 overflow-hidden min-h-[46px] flex items-center">
      <AnimatePresence mode="popLayout">
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="w-full"
          >
            {/* Minimal Header */}
            <div className="flex items-center gap-1.5 mb-1.5 px-1">
              <Sparkles size={11} className="text-sky-500 animate-pulse" />
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                Saran Tindakan Terkait
              </span>
            </div>

            {/* Horizontal Scrolling Suggestion Tags */}
            <motion.div 
              layout
              className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x"
            >
              {suggestions.map((suggestion) => (
                <motion.button
                  key={suggestion.id}
                  layoutId={`pill-${suggestion.id}`}
                  onClick={(e) => {
                    // Prevent form submit/blur issues
                    e.preventDefault();
                    onSelectSuggestion(suggestion);
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "rgba(240, 249, 255, 0.9)", // sky-50/90
                    boxShadow: "0 4px 12px rgba(14, 165, 233, 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25 
                  }}
                  className="flex items-center gap-1.5 bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 rounded-full px-3 py-1.5 cursor-pointer text-left snap-start whitespace-nowrap shrink-0 group transition-colors duration-200"
                >
                  <Activity size={10} className="text-slate-400 dark:text-slate-600 group-hover:text-sky-500 transition-colors" />
                  <div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {suggestion.text}
                    </span>
                    {suggestion.description && (
                      <span className="block text-[8px] font-medium text-slate-400 dark:text-slate-500 max-w-[200px] truncate">
                        {suggestion.description}
                      </span>
                    )}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
