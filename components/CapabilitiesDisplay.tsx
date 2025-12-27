'use client';

import { Capabilities } from '@/types';
import { getCapabilityOrder, hasCapabilities } from '@/lib/capabilities';

interface CapabilitiesDisplayProps {
  capabilities: Capabilities | undefined;
  className?: string;
  showEmptyState?: boolean;
}

/**
 * Editorial-style capabilities display
 *
 * Design requirements (strict):
 * - Calm, editorial layout
 * - No badges, no pills, no tags
 * - Group titles in muted bold
 * - Skills inline, separated by dots
 * - No icons, no percentages, no confidence indicators
 */
export default function CapabilitiesDisplay({
  capabilities,
  className = '',
  showEmptyState = true,
}: CapabilitiesDisplayProps) {
  // Empty state
  if (!hasCapabilities(capabilities)) {
    if (!showEmptyState) return null;
    return (
      <div className={className}>
        <p className="text-sm text-muted-foreground italic">
          Capabilities will appear once this profile is reviewed.
        </p>
      </div>
    );
  }

  // Get ordered capabilities (only show non-empty groups)
  const orderedCapabilities = getCapabilityOrder()
    .filter(cap => capabilities![cap]?.length > 0)
    .map(cap => ({
      name: cap,
      skills: capabilities![cap],
    }));

  return (
    <div className={`space-y-4 ${className}`}>
      {orderedCapabilities.map(({ name, skills }) => (
        <div key={name}>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {name}
          </p>
          <p className="text-sm text-foreground">
            {skills.join(' · ')}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * Compact inline version for card views
 */
export function CapabilitiesInline({
  capabilities,
  maxGroups = 2,
  className = '',
}: {
  capabilities: Capabilities | undefined;
  maxGroups?: number;
  className?: string;
}) {
  if (!hasCapabilities(capabilities)) {
    return null;
  }

  const orderedCapabilities = getCapabilityOrder()
    .filter(cap => capabilities![cap]?.length > 0)
    .slice(0, maxGroups)
    .map(cap => ({
      name: cap,
      skills: capabilities![cap].slice(0, 3), // Max 3 skills per group inline
    }));

  return (
    <div className={`text-sm text-muted-foreground ${className}`}>
      {orderedCapabilities.map(({ name, skills }, idx) => (
        <span key={name}>
          {idx > 0 && <span className="mx-2">|</span>}
          <span className="font-medium">{name}:</span>{' '}
          {skills.join(' · ')}
        </span>
      ))}
    </div>
  );
}
