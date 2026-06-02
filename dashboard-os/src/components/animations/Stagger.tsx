/**
 * StaggerList + StaggerItem — entrance animation for card grids and lists.
 *
 * Usage:
 *   <StaggerList className="grid grid-cols-3 gap-4">
 *     {items.map(item => (
 *       <StaggerItem key={item.id}>
 *         <Card>...</Card>
 *       </StaggerItem>
 *     ))}
 *   </StaggerList>
 *
 * Each item fades in and rises 10px with a 50ms stagger between children.
 */
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import type { ReactNode } from 'react'

const listVariants: Variants = {
  hidden:  {},
  visible: {
    transition: {
      staggerChildren:  0.05,
      delayChildren:    0.04,
    },
  },
}

const itemVariants: Variants = {
  hidden:  { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: 'easeOut' },
  },
}

interface StaggerListProps {
  children: ReactNode
  className?: string
}

export function StaggerList({ children, className }: StaggerListProps) {
  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: ReactNode
  className?: string
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}
