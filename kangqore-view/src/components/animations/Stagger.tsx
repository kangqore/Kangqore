/**
 * Stagger animation primitives.
 *
 * Card grids / vertical lists:
 *   <StaggerList className="grid grid-cols-3 gap-4">
 *     {items.map(i => <StaggerItem key={i.id}><Card>...</Card></StaggerItem>)}
 *   </StaggerList>
 *
 * Table rows (tbody/tr — div is invalid inside tbody):
 *   <StaggerTableBody>
 *     {rows.map(r => <StaggerRow key={r.id} className="..."><td>...</td></StaggerRow>)}
 *   </StaggerTableBody>
 *
 * Each child fades in and rises 10px. 50ms stagger between siblings.
 */
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import type { ReactNode } from 'react'

const listVariants: Variants = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
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

// ─── Card / div lists ─────────────────────────────────────────────────────────

interface StaggerListProps { children: ReactNode; className?: string }

export function StaggerList({ children, className }: StaggerListProps) {
  return (
    <motion.div variants={listVariants} initial="hidden" animate="visible" className={className}>
      {children}
    </motion.div>
  )
}

interface StaggerItemProps { children: ReactNode; className?: string }

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}

// ─── Table rows (tbody + tr) ──────────────────────────────────────────────────

interface StaggerTableBodyProps { children: ReactNode; className?: string }

export function StaggerTableBody({ children, className }: StaggerTableBodyProps) {
  return (
    <motion.tbody variants={listVariants} initial="hidden" animate="visible" className={className}>
      {children}
    </motion.tbody>
  )
}

interface StaggerRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode
}

export function StaggerRow({ children, ...props }: StaggerRowProps) {
  return (
    <motion.tr variants={itemVariants} {...(props as object)}>
      {children}
    </motion.tr>
  )
}
