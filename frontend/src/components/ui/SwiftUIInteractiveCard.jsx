import React from 'react';
import { motion } from 'framer-motion';
import { triggerHaptic } from '../../utils/haptics';

export const swiftUISpring = {
  type: 'spring',
  stiffness: 380,
  damping: 24,
  mass: 0.8,
};

export const SwiftUIInteractiveCard = ({ children, className = '', onClick, hapticStyle = 'light' }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
    transition={swiftUISpring}
    onClick={(e) => {
      triggerHaptic(hapticStyle);
      onClick?.(e);
    }}
    className={`swiftui-glass rounded-3xl p-6 shadow-2xl transition-colors duration-300 ${className}`}
  >
    {children}
  </motion.div>
);

export default SwiftUIInteractiveCard;
