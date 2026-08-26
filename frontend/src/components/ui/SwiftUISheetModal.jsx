import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHaptic } from '../../utils/haptics';

export const SwiftUISheetModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 backdrop-blur-md p-0 sm:p-4">
        {/* Backdrop Click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            triggerHaptic('light');
            onClose();
          }}
          className="absolute inset-0"
        />

        {/* Draggable SwiftUI Sheet Modal */}
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 400 }}
          dragElastic={0.15}
          onDragEnd={(e, info) => {
            if (info.offset.y > 120 || info.velocity.y > 450) {
              triggerHaptic('light');
              onClose();
            }
          }}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="relative z-10 w-full max-w-2xl rounded-t-[32px] sm:rounded-[32px] swiftui-glass p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* SwiftUI Sheet Grabber Bar */}
          <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-white/35 active:bg-white/60 transition-colors cursor-grab active:cursor-grabbing" />

          {title && (
            <div className="mb-4 text-center">
              <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
            </div>
          )}

          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SwiftUISheetModal;
