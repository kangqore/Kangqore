import * as Dialog from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../cn'
import { spring } from '@os/motion'

const sizeMap = {
  sm:   'max-w-md',
  md:   'max-w-lg',
  lg:   'max-w-2xl',
  xl:   'max-w-4xl',
  full: 'max-w-[95vw]',
}

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: keyof typeof sizeMap
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

function Modal({ open, onClose, title, description, size = 'md', children, footer, className }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#0B1121]/80 backdrop-blur-sm z-50 animate-in fade-in-0 duration-150" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full',
            sizeMap[size],
          )}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ ...spring.snappy, opacity: { duration: 0.12, ease: 'easeOut' } }}
            className={cn(
              'bg-[#151C2F] border border-[#2E2854] rounded-2xl shadow-xl w-full',
              className
            )}
          >
            {(title || description) && (
              <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-[#2E2854]">
                <div>
                  {title && (
                    <Dialog.Title className="text-base font-semibold text-white">
                      {title}
                    </Dialog.Title>
                  )}
                  {description && (
                    <Dialog.Description className="mt-1 text-sm text-slate-500">
                      {description}
                    </Dialog.Description>
                  )}
                </div>
                <Dialog.Close
                  onClick={onClose}
                  className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-[#0F172A]"
                >
                  <X className="w-4 h-4" />
                </Dialog.Close>
              </div>
            )}

            <div className="px-6 py-5">{children}</div>

            {footer && (
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#2E2854]">
                {footer}
              </div>
            )}
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { Modal }
