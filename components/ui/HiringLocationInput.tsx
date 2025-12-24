'use client';

import { useState } from 'react';
import Input from './Input';
import { HiringLocation } from '@/types';

// Common countries for quick selection
const COMMON_COUNTRIES = [
  'United States',
  'United Kingdom',
  'Germany',
  'France',
  'Netherlands',
  'Canada',
  'Australia',
  'Spain',
  'Italy',
  'Poland',
  'Sweden',
  'Switzerland',
  'Portugal',
  'Ireland',
  'Austria',
  'Belgium',
  'Denmark',
  'Norway',
  'Finland',
  'Czech Republic',
  'India',
  'Brazil',
  'Mexico',
  'Singapore',
  'Japan',
  'South Korea',
  'Israel',
  'United Arab Emirates',
];

// Common timezones
const TIMEZONES = [
  { value: 'UTC-12:00', label: 'UTC-12:00 (Baker Island)' },
  { value: 'UTC-11:00', label: 'UTC-11:00 (American Samoa)' },
  { value: 'UTC-10:00', label: 'UTC-10:00 (Hawaii)' },
  { value: 'UTC-09:00', label: 'UTC-09:00 (Alaska)' },
  { value: 'UTC-08:00', label: 'UTC-08:00 (Pacific Time)' },
  { value: 'UTC-07:00', label: 'UTC-07:00 (Mountain Time)' },
  { value: 'UTC-06:00', label: 'UTC-06:00 (Central Time)' },
  { value: 'UTC-05:00', label: 'UTC-05:00 (Eastern Time)' },
  { value: 'UTC-04:00', label: 'UTC-04:00 (Atlantic Time)' },
  { value: 'UTC-03:00', label: 'UTC-03:00 (Buenos Aires)' },
  { value: 'UTC-02:00', label: 'UTC-02:00 (Mid-Atlantic)' },
  { value: 'UTC-01:00', label: 'UTC-01:00 (Azores)' },
  { value: 'UTC+00:00', label: 'UTC+00:00 (London, Dublin)' },
  { value: 'UTC+01:00', label: 'UTC+01:00 (Berlin, Paris, CET)' },
  { value: 'UTC+02:00', label: 'UTC+02:00 (Helsinki, Athens, EET)' },
  { value: 'UTC+03:00', label: 'UTC+03:00 (Moscow, Istanbul)' },
  { value: 'UTC+04:00', label: 'UTC+04:00 (Dubai)' },
  { value: 'UTC+05:00', label: 'UTC+05:00 (Karachi)' },
  { value: 'UTC+05:30', label: 'UTC+05:30 (Mumbai, Delhi)' },
  { value: 'UTC+06:00', label: 'UTC+06:00 (Dhaka)' },
  { value: 'UTC+07:00', label: 'UTC+07:00 (Bangkok, Jakarta)' },
  { value: 'UTC+08:00', label: 'UTC+08:00 (Singapore, Hong Kong)' },
  { value: 'UTC+09:00', label: 'UTC+09:00 (Tokyo, Seoul)' },
  { value: 'UTC+10:00', label: 'UTC+10:00 (Sydney)' },
  { value: 'UTC+11:00', label: 'UTC+11:00 (Solomon Islands)' },
  { value: 'UTC+12:00', label: 'UTC+12:00 (Auckland)' },
];

interface HiringLocationInputProps {
  value: HiringLocation;
  onChange: (location: HiringLocation) => void;
  label?: string;
}

export default function HiringLocationInput({
  value,
  onChange,
  label = 'Hiring Location',
}: HiringLocationInputProps) {
  const [showTimezone, setShowTimezone] = useState(false);

  const handleChange = (field: keyof HiringLocation, fieldValue: string | boolean) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  return (
    <div className="space-y-4">
      {label && (
        <h3 className="text-sm font-medium text-gray-700">{label}</h3>
      )}

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={value.isRemote}
          onChange={(e) => handleChange('isRemote', e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="text-sm font-medium text-gray-900">This role is remote-friendly</span>
      </label>

      <div className="space-y-3">
        <p className="text-sm text-gray-500">
          {value.isRemote
            ? 'Target location (optional for remote roles)'
            : 'Office location (required for onsite roles)'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <select
              value={value.country || ''}
              onChange={(e) => handleChange('country', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select country...</option>
              {COMMON_COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="City"
            value={value.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="e.g. Berlin"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowTimezone(!showTimezone)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showTimezone ? '− Hide timezone preference' : '+ Add preferred timezone'}
        </button>

        {showTimezone && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Timezone
            </label>
            <select
              value={value.timezone || ''}
              onChange={(e) => handleChange('timezone', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any timezone</option>
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 italic">
        {value.isRemote && !value.country
          ? 'Example: Remote-first startup - no location preference'
          : value.isRemote && value.country
          ? `Example: Remote-friendly, prefer ${value.country} timezone`
          : value.country
          ? `Example: Onsite role in ${value.city || value.country}`
          : 'Example: Berlin onsite role - select Germany > Berlin'}
      </p>
    </div>
  );
}
