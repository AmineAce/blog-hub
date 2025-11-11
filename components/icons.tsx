'use client'

// Centralized icon exports to enable better tree-shaking
// This approach allows Next.js 15's optimizePackageImports to work effectively

// Search related icons
export { Search } from 'lucide-react'

// UI action icons
export { 
  Check, 
  X,
  Minus,
  GripVertical,
  RefreshCw
} from 'lucide-react'

// Navigation icons
export {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Circle,
  PanelLeft,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'

// Alert icons
export { AlertTriangle } from 'lucide-react'

// Re-export with common aliases for easier importing
export { 
  X as XIcon,
  Check as CheckIcon,
  ChevronRight as ChevronRightIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  Circle as CircleIcon,
  PanelLeft as PanelLeftIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon
} from 'lucide-react'

// Icon size utility component
interface IconWrapperProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const IconWrapper = ({ 
  children, 
  className,
  size = 'md'
}: IconWrapperProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  }
  
  return (
    <div className={`inline-flex items-center justify-center ${sizeClasses[size]} ${className || ''}`}>
      {children}
    </div>
  )
}
