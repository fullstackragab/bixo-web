'use client';

import { RemotePreference } from '@/types';

interface RemotePreferenceSelectProps {
  value: RemotePreference | undefined;
  onChange: (value: RemotePreference) => void;
  label?: string;
  layout?: 'horizontal' | 'vertical';
}

const REMOTE_OPTIONS = [
  { value: RemotePreference.Remote, label: 'Remote only', description: 'Work fully remotely' },
  { value: RemotePreference.Hybrid, label: 'Hybrid', description: 'Mix of remote and office' },
  { value: RemotePreference.Onsite, label: 'Onsite', description: 'Work from office' },
  { value: RemotePreference.Flexible, label: 'Flexible', description: 'Open to any arrangement' },
];

export default function RemotePreferenceSelect({
  value,
  onChange,
  label = 'Work Mode Preference',
  layout = 'vertical',
}: RemotePreferenceSelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className={layout === 'horizontal' ? 'flex flex-wrap gap-3' : 'space-y-2'}>
        {REMOTE_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`
              flex items-center gap-2 cursor-pointer p-2 rounded-lg border transition-colors
              ${value === option.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <input
              type="radio"
              name="remotePreference"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">{option.label}</span>
              {layout === 'vertical' && (
                <p className="text-xs text-gray-500">{option.description}</p>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
