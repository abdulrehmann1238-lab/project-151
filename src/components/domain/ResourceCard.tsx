import React from 'react';
import { Resource } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { SourceBadge } from '../ui/SourceBadge';
import { Globe, FileText, MapPin, Phone, ExternalLink } from 'lucide-react';

export interface ResourceCardProps {
  resource: Resource;
  className?: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, className = '' }) => {
  const { openSourceDrawer } = useAppStore();

  const getTypeIcon = () => {
    switch (resource.type) {
      case 'website':
        return <Globe className="w-4 h-4 text-secondary" />;
      case 'form':
        return <FileText className="w-4 h-4 text-primary" />;
      case 'office':
        return <MapPin className="w-4 h-4 text-accent" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-emerald-600" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div
      onClick={() => openSourceDrawer(resource)}
      className={`
        p-4 sm:p-5 rounded-md border border-border bg-surface hover:bg-surface-elevated hover:border-primary
        transition-all duration-fast text-left cursor-pointer group flex flex-col justify-between
        ${className}
      `}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-surface border border-border group-hover:border-primary/40 transition-colors">
              {getTypeIcon()}
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold text-ink-3">
              {resource.type}
            </span>
          </div>
          <SourceBadge type={resource.badge} lastChecked={resource.lastChecked} />
        </div>

        <h4 className="text-[16px] font-medium text-ink group-hover:text-primary transition-colors leading-snug">
          {resource.name}
        </h4>

        <p className="text-xs text-ink-3 font-medium mt-0.5">{resource.agency}</p>

        <p className="text-[14px] text-ink-2 mt-3 leading-relaxed line-clamp-2">
          {resource.why}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-semibold text-primary">
        <span>View details & verified source</span>
        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
};
