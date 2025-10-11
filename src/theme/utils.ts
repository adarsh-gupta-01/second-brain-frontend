// Theme utility functions and classes for consistent styling

// CSS class builders using our theme
export const buttonClasses = {
  base: 'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  
  primary: `bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus:ring-indigo-400 shadow-sm hover:shadow-md`,
  
  secondary: `bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 focus:ring-slate-400 border border-slate-200`,
  
  danger: `bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-400 shadow-sm hover:shadow-md`,
  
  ghost: `text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400`,
  
  link: `text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline focus:ring-indigo-400`,
}

export const cardClasses = {
  base: 'bg-white rounded-xl border border-slate-200 shadow-sm transition-all duration-200',
  
  hover: 'hover:shadow-lg hover:border-blue-200 hover:bg-blue-50/30 hover:scale-[1.02]',
  
  interactive: 'cursor-pointer group',
  
  content: 'p-4',
  
  header: 'px-4 pt-4 pb-2',
  
  footer: 'px-4 pb-4 pt-2',
}

export const sidebarClasses = {
  container: 'fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-200 z-40 transform transition-transform duration-300 ease-in-out',
  
  item: {
    base: 'flex items-center justify-between gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 w-full text-left group border border-transparent',
    
    default: 'text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100',
    
    active: 'bg-blue-50 border border-blue-200 text-blue-700 shadow-sm',
    
    logout: 'text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100',
  }
}

export const modalClasses = {
  backdrop: 'fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity',
  
  container: 'fixed inset-0 z-50 flex items-center justify-center',
  
  panel: 'relative w-full max-w-md mx-4 transform transition-all bg-white rounded-2xl shadow-xl p-6 border border-slate-200',
  
  header: 'flex items-center justify-between mb-4',
  
  content: 'mt-2 mb-6',
  
  footer: 'flex gap-3 justify-end',
}

export const inputClasses = {
  base: 'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors',
  
  error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
  
  success: 'border-green-300 focus:border-green-500 focus:ring-green-500',
}

export const badgeClasses = {
  base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
  
  primary: 'bg-indigo-100 text-indigo-800',
  
  secondary: 'bg-slate-100 text-slate-800',
  
  success: 'bg-green-100 text-green-800',
  
  warning: 'bg-yellow-100 text-yellow-800',
  
  error: 'bg-red-100 text-red-800',
}

// Layout utilities
export const layoutClasses = {
  container: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
  
  section: 'py-8',
  
  grid: {
    responsive: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
    dense: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
  },
  
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end',
  }
}

// Typography utilities
export const textClasses = {
  heading: {
    h1: 'text-3xl font-bold text-slate-900',
    h2: 'text-2xl font-bold text-slate-900',
    h3: 'text-xl font-semibold text-slate-900',
    h4: 'text-lg font-semibold text-slate-900',
  },
  
  body: {
    large: 'text-base text-slate-700',
    base: 'text-sm text-slate-600',
    small: 'text-xs text-slate-500',
  },
  
  link: 'text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline transition-colors',
  
  muted: 'text-slate-500',
  
  error: 'text-red-600',
  
  success: 'text-green-600',
  
  warning: 'text-yellow-600',
}

// Animation utilities
export const animationClasses = {
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  spin: 'animate-spin',
  pulse: 'animate-pulse',
}

// Helper function to combine classes
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}

// Responsive breakpoint utilities
export const breakpointClasses = {
  hideOnMobile: 'hidden sm:block',
  hideOnDesktop: 'block sm:hidden',
  showOnTablet: 'hidden md:block lg:hidden',
}

export default {
  buttonClasses,
  cardClasses,
  sidebarClasses,
  modalClasses,
  inputClasses,
  badgeClasses,
  layoutClasses,
  textClasses,
  animationClasses,
  breakpointClasses,
  cn,
}