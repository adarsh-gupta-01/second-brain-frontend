interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  count?: number;
  itemKey?: string; // Add itemKey to determine brand colors
}

// Brand-specific color schemes
const getBrandColors = (itemKey: string) => {
  const brandColors: Record<string, { bg: string; text: string; border: string; shadow: string }> = {
    twitter: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200',
      shadow: 'shadow-blue-200/50'
    },
    tweet: {
      bg: 'bg-blue-50',
      text: 'text-blue-600', 
      border: 'border-blue-200',
      shadow: 'shadow-blue-200/50'
    },
    youtube: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-200',
      shadow: 'shadow-red-200/50'
    },
    instagram: {
      bg: 'bg-pink-50',
      text: 'text-pink-600',
      border: 'border-pink-200',
      shadow: 'shadow-pink-200/50'
    },
    image: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-200',
      shadow: 'shadow-emerald-200/50'
    },
    doc: {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      border: 'border-orange-200',
      shadow: 'shadow-orange-200/50'
    },
    note: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      border: 'border-yellow-200',
      shadow: 'shadow-yellow-200/50'
    },
    links: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-600',
      border: 'border-cyan-200',
      shadow: 'shadow-cyan-200/50'
    }
  };

  return brandColors[itemKey] || {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
    shadow: 'shadow-blue-200/50'
  };
};

export const SidebarItem = ({ icon, label, onClick, active = false, count, itemKey = 'default' }: SidebarItemProps) => {
  const brandColors = getBrandColors(itemKey);
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 w-full text-left group border ${
        active 
          ? `${brandColors.bg} ${brandColors.border} ${brandColors.text} shadow-lg ${brandColors.shadow}` 
          : 'text-slate-600 hover:shadow-lg hover:shadow-blue-200/40 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 border-transparent'
      }`}
      aria-label={`${label}${count ? ` (${count} items)` : ''}`}
    >
      <div className="flex items-center gap-3">
        <span className={`transition-all duration-200 ${
          active ? brandColors.text : 'group-hover:text-blue-500 group-hover:scale-110'
        }`}>
          {icon}
        </span>
        <span className="font-medium">{label}</span>
      </div>
      {count !== undefined && count > 0 && (
        <span className={`text-xs px-2 py-1 rounded-full font-semibold transition-all duration-200 ${
          active 
            ? `bg-white/70 ${brandColors.text} shadow-sm` 
            : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 group-hover:shadow-sm'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
};

export default SidebarItem;
