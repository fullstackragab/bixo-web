'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import HiringLocationInput from '@/components/ui/HiringLocationInput';
import api from '@/lib/api';
import { ShortlistStatus, SeniorityLevel, HiringLocation } from '@/types';

interface ShortlistRequest {
  id: string;
  roleTitle: string;
  techStackRequired: string[];
  seniorityRequired: SeniorityLevel | null;
  status: ShortlistStatus;
  candidatesCount: number;
  createdAt: string;
}

export default function CompanyShortlistsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [shortlists, setShortlists] = useState<ShortlistRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form state
  const [roleTitle, setRoleTitle] = useState('');
  const [techStack, setTechStack] = useState('');
  const [seniority, setSeniority] = useState('');
  const [hiringLocation, setHiringLocation] = useState<HiringLocation>({ isRemote: true });
  const [notes, setNotes] = useState('');

  const loadShortlists = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<ShortlistRequest[]>('/shortlists');
      if (res.success && res.data) {
        setShortlists(res.data);
      } else {
        setError(res.error || 'Failed to load shortlists');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      loadShortlists();
    }
  }, [authLoading, user, loadShortlists]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    // Parse tech stack into array, ensure it's not empty
    const techStackArray = techStack
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    // Build location display text for legacy compatibility
    const locationDisplayText = [
      hiringLocation.city,
      hiringLocation.country,
    ].filter(Boolean).join(', ') || null;

    try {
      const res = await api.post<{ id: string }>('/shortlists/request', {
        roleTitle,
        techStackRequired: techStackArray.length > 0 ? techStackArray : [],
        seniorityRequired: seniority ? parseInt(seniority) : null,
        hiringLocation,
        locationPreference: locationDisplayText, // Keep legacy field populated
        remoteAllowed: hiringLocation.isRemote, // Keep legacy field populated
        additionalNotes: notes || null
      });

      if (res.success) {
        setShowForm(false);
        setRoleTitle('');
        setTechStack('');
        setSeniority('');
        setHiringLocation({ isRemote: true });
        setNotes('');
        loadShortlists();
      } else {
        // Handle both 'error' and 'message' fields from API
        const errorMsg = res.error || (res as unknown as { message?: string }).message || 'Failed to submit shortlist request';
        setFormError(errorMsg);
      }
    } catch {
      setFormError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: ShortlistStatus) => {
    switch (status) {
      case ShortlistStatus.Pending:
        return <Badge variant="warning">Pending</Badge>;
      case ShortlistStatus.Processing:
        return <Badge variant="primary">Processing</Badge>;
      case ShortlistStatus.Completed:
        return <Badge variant="success">Completed</Badge>;
      case ShortlistStatus.Cancelled:
        return <Badge variant="danger">Cancelled</Badge>;
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shortlists</h1>
            <p className="text-gray-500 mt-1">Get curated candidate shortlists for your roles</p>
          </div>
          <Button onClick={() => { setShowForm(!showForm); setFormError(null); }}>
            {showForm ? 'Cancel' : 'Request Shortlist'}
          </Button>
        </div>

        {/* Request Form */}
        {showForm && (
          <Card className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Request a Shortlist</h2>
            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {formError}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Role Title"
                id="roleTitle"
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                required
              />

              <Input
                label="Required Tech Stack"
                id="techStack"
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder="Python, Django, PostgreSQL (comma separated)"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seniority Level</label>
                <select
                  value={seniority}
                  onChange={(e) => setSeniority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Any</option>
                  <option value="0">Junior</option>
                  <option value="1">Mid</option>
                  <option value="2">Senior</option>
                  <option value="3">Lead</option>
                  <option value="4">Principal</option>
                </select>
              </div>

              <HiringLocationInput
                label="Hiring Location"
                value={hiringLocation}
                onChange={setHiringLocation}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any other requirements or preferences..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" isLoading={isSubmitting}>Submit Request</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        {/* Shortlists List */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Shortlists</h2>

          {shortlists.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tech Stack</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidates</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {shortlists.map((shortlist) => (
                    <tr key={shortlist.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{shortlist.roleTitle}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {shortlist.techStackRequired?.slice(0, 3).map((tech, i) => (
                            <Badge key={i} variant="default">{tech}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(shortlist.status)}</td>
                      <td className="px-4 py-3 text-gray-600">{shortlist.candidatesCount}</td>
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        {new Date(shortlist.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/company/shortlists/${shortlist.id}`}>
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No shortlists yet</p>
              <Button className="mt-4" onClick={() => setShowForm(true)}>Request Your First Shortlist</Button>
            </div>
          )}
        </Card>

        {/* Pricing */}
        <Card className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Shortlist Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg text-center">
              <p className="font-medium text-gray-900">Single Shortlist</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">$299</p>
              <p className="text-sm text-gray-500">Per role</p>
            </div>
            <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg text-center">
              <p className="font-medium text-gray-900">5 Shortlists</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">$1,299</p>
              <p className="text-sm text-green-600">Save 13%</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg text-center">
              <p className="font-medium text-gray-900">10 Shortlists</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">$2,299</p>
              <p className="text-sm text-green-600">Save 23%</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
