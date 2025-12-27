'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { AdminRecommendation } from '@/types';

const REJECTION_REASONS = [
  'Low quality / lacks substance',
  'Appears exaggerated or false',
  'Unprofessional language',
  'Generic / not specific to candidate',
  'Potential conflict of interest',
];

export default function AdminRecommendationsPage() {
  const [recommendations, setRecommendations] = useState<AdminRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Rejection modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const loadRecommendations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<AdminRecommendation[]>('/admin/recommendations');
      if (res.success && res.data) {
        setRecommendations(res.data);
      } else {
        setError(res.error || 'Failed to load recommendations');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await api.post(`/admin/recommendations/${id}/approve`);
      if (res.success) {
        await loadRecommendations();
      } else {
        setError(res.error || 'Failed to approve recommendation');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = (id: string) => {
    setRejectingId(id);
    setRejectReason('');
    setCustomReason('');
    setRejectModalOpen(true);
  };

  const handleReject = async () => {
    if (!rejectingId) return;

    const reason = rejectReason === 'custom' ? customReason : rejectReason;
    if (!reason.trim()) {
      setError('Please provide a rejection reason');
      return;
    }

    setActionLoading(rejectingId);
    try {
      const res = await api.post(`/admin/recommendations/${rejectingId}/reject`, { reason });
      if (res.success) {
        setRejectModalOpen(false);
        setRejectingId(null);
        await loadRecommendations();
      } else {
        setError(res.error || 'Failed to reject recommendation');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
          <button
            onClick={() => { setError(null); loadRecommendations(); }}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Pending Recommendations</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and approve recommendations before they become visible to companies
          </p>
        </div>
        <Link href="/admin/dashboard">
          <Button variant="outline" size="sm">Back to Dashboard</Button>
        </Link>
      </div>

      {recommendations.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending recommendations</h3>
            <p className="text-gray-500">All recommendations have been reviewed</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <Card key={rec.id}>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">Recommendation for {rec.candidateName}</h3>
                    <Badge variant="warning">Pending Review</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    From: {rec.recommenderName}
                    {rec.recommenderRole && `, ${rec.recommenderRole}`}
                    {rec.recommenderCompany && ` at ${rec.recommenderCompany}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    Relationship: {rec.relationship}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Submitted: {new Date(rec.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(rec.id)}
                    disabled={actionLoading === rec.id}
                  >
                    {actionLoading === rec.id ? 'Approving...' : 'Approve'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openRejectModal(rec.id)}
                    disabled={actionLoading === rec.id}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Reject
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className={`text-sm text-gray-700 whitespace-pre-wrap ${expandedId !== rec.id ? 'line-clamp-4' : ''}`}>
                  &ldquo;{rec.content}&rdquo;
                </p>
                {rec.content.length > 300 && (
                  <button
                    onClick={() => toggleExpand(rec.id)}
                    className="text-blue-600 text-sm mt-2 hover:underline"
                  >
                    {expandedId === rec.id ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>

              {/* Additional info */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                <span>Recommender Email: {rec.recommenderEmail}</span>
                <span>Candidate ID: {rec.candidateId.slice(0, 8)}...</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 transition-opacity"
              onClick={() => setRejectModalOpen(false)}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md transform rounded-xl bg-white p-6 shadow-xl transition-all">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Reject Recommendation</h2>

              <div className="space-y-3 mb-4">
                {REJECTION_REASONS.map((reason) => (
                  <label key={reason} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="rejectReason"
                      value={reason}
                      checked={rejectReason === reason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{reason}</span>
                  </label>
                ))}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="rejectReason"
                    value="custom"
                    checked={rejectReason === 'custom'}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Other (custom reason)</span>
                </label>
              </div>

              {rejectReason === 'custom' && (
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Enter rejection reason..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                />
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setRejectModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleReject}
                  disabled={!rejectReason || (rejectReason === 'custom' && !customReason.trim())}
                  className="flex-1"
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
