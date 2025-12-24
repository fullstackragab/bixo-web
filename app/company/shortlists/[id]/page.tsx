'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { ShortlistStatus, SeniorityLevel, Availability } from '@/types';

interface ShortlistCandidate {
  candidateId: string;
  firstName: string | null;
  lastName: string | null;
  desiredRole: string | null;
  seniorityEstimate: SeniorityLevel | null;
  availability: Availability;
  matchScore: number;
  matchReason: string | null;
  rank: number;
  skills: string[];
}

interface ShortlistDetail {
  id: string;
  roleTitle: string;
  techStackRequired: string[];
  seniorityRequired: SeniorityLevel | null;
  locationPreference: string | null;
  remoteAllowed: boolean;
  additionalNotes: string | null;
  status: ShortlistStatus;
  createdAt: string;
  candidates: ShortlistCandidate[];
}

export default function CompanyShortlistDetailPage() {
  const params = useParams();
  const shortlistId = params.id as string;
  const { user, isLoading: authLoading } = useAuth();

  const [shortlist, setShortlist] = useState<ShortlistDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user && shortlistId) {
      loadShortlist();
    }
  }, [authLoading, user, shortlistId]);

  const loadShortlist = async () => {
    setIsLoading(true);
    const res = await api.get<ShortlistDetail>(`/shortlists/${shortlistId}`);
    if (res.success && res.data) {
      setShortlist(res.data);
    }
    setIsLoading(false);
  };

  const getStatusBadge = (status: ShortlistStatus) => {
    switch (status) {
      case ShortlistStatus.Pending:
        return <Badge variant="warning">Pending Review</Badge>;
      case ShortlistStatus.Processing:
        return <Badge variant="primary">Being Curated</Badge>;
      case ShortlistStatus.Completed:
        return <Badge variant="success">Ready</Badge>;
      case ShortlistStatus.Cancelled:
        return <Badge variant="danger">Cancelled</Badge>;
    }
  };

  const getSeniorityLabel = (seniority: SeniorityLevel | null) => {
    if (seniority === null) return 'Any';
    const labels = ['Junior', 'Mid', 'Senior', 'Lead', 'Principal'];
    return labels[seniority];
  };

  const getAvailabilityBadge = (availability: Availability) => {
    switch (availability) {
      case Availability.Open:
        return <Badge variant="success">Actively Looking</Badge>;
      case Availability.Passive:
        return <Badge variant="warning">Open</Badge>;
      case Availability.NotNow:
        return <Badge variant="default">Not Looking</Badge>;
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!shortlist) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-500">Shortlist not found</p>
          <Link href="/company/shortlists">
            <Button className="mt-4">Back to Shortlists</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <Link href="/company/shortlists" className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block">
              &larr; Back to Shortlists
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{shortlist.roleTitle}</h1>
            <div className="flex items-center gap-3 mt-2">
              {getStatusBadge(shortlist.status)}
              <span className="text-gray-500">
                Created {new Date(shortlist.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Tech Stack</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {shortlist.techStackRequired?.map((tech, i) => (
                  <Badge key={i} variant="primary">{tech}</Badge>
                )) || <span className="text-gray-600">Any</span>}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Seniority</p>
              <p className="font-medium text-gray-900">{getSeniorityLabel(shortlist.seniorityRequired)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium text-gray-900">
                {shortlist.locationPreference || 'Any'}
                {shortlist.remoteAllowed && <span className="text-green-600 ml-1">(Remote OK)</span>}
              </p>
            </div>
          </div>
          {shortlist.additionalNotes && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">Notes</p>
              <p className="text-gray-700">{shortlist.additionalNotes}</p>
            </div>
          )}
        </Card>

        {/* Candidates */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Matched Candidates ({shortlist.candidates.length})
          </h2>

          {shortlist.status === ShortlistStatus.Completed && shortlist.candidates.length > 0 ? (
            <div className="space-y-4">
              {shortlist.candidates
                .sort((a, b) => a.rank - b.rank)
                .map((candidate) => (
                  <div
                    key={candidate.candidateId}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-blue-600">#{candidate.rank}</span>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {candidate.firstName && candidate.lastName
                                ? `${candidate.firstName} ${candidate.lastName.charAt(0)}.`
                                : 'Candidate'}
                            </h3>
                            {candidate.desiredRole && (
                              <p className="text-sm text-gray-600">{candidate.desiredRole}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {getAvailabilityBadge(candidate.availability)}
                          {candidate.seniorityEstimate !== null && (
                            <Badge variant="default">{getSeniorityLabel(candidate.seniorityEstimate)}</Badge>
                          )}
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded font-medium">
                            {candidate.matchScore}% match
                          </span>
                        </div>

                        {candidate.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {candidate.skills.slice(0, 8).map((skill, i) => (
                              <Badge key={i} variant="primary">{skill}</Badge>
                            ))}
                          </div>
                        )}

                        {candidate.matchReason && (
                          <p className="text-sm text-gray-500 mt-3 italic">{candidate.matchReason}</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Profile</Button>
                        <Button size="sm">Message</Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : shortlist.status === ShortlistStatus.Pending || shortlist.status === ShortlistStatus.Processing ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">
                {shortlist.status === ShortlistStatus.Pending
                  ? 'Your shortlist request is being reviewed...'
                  : 'Our team is curating the best candidates for you...'}
              </p>
              <p className="text-sm text-gray-400 mt-2">You&apos;ll be notified when ready</p>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No candidates available</p>
          )}
        </Card>
      </main>
    </div>
  );
}
