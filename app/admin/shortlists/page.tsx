'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { ShortlistStatus, SeniorityLevel } from '@/types';

interface AdminShortlist {
  id: string;
  companyId: string;
  companyName: string;
  roleTitle: string;
  techStackRequired: string[];
  seniorityRequired: SeniorityLevel | null;
  locationPreference: string | null;
  remoteAllowed: boolean;
  additionalNotes: string | null;
  status: ShortlistStatus;
  pricePaid: number | null;
  candidatesCount: number;
  createdAt: string;
  completedAt: string | null;
}

interface PaginatedResponse {
  items: AdminShortlist[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function AdminShortlistsPage() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [shortlists, setShortlists] = useState<AdminShortlist[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>(initialStatus);

  useEffect(() => {
    loadShortlists();
  }, [page, filterStatus]);

  const loadShortlists = async () => {
    setIsLoading(true);
    let url = `/admin/shortlists?page=${page}&pageSize=${pageSize}`;
    if (filterStatus !== 'all') {
      const statusValue = {
        pending: 0,
        processing: 1,
        completed: 2,
        cancelled: 3
      }[filterStatus];
      if (statusValue !== undefined) {
        url += `&status=${statusValue}`;
      }
    }

    const res = await api.get<PaginatedResponse>(url);
    if (res.success && res.data) {
      setShortlists(res.data.items);
      setTotalCount(res.data.totalCount);
    }
    setIsLoading(false);
  };

  const updateStatus = async (shortlistId: string, status: ShortlistStatus) => {
    const res = await api.put(`/admin/shortlists/${shortlistId}/status`, { status });
    if (res.success) {
      setShortlists(shortlists.map(s =>
        s.id === shortlistId ? { ...s, status } : s
      ));
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

  const getSeniorityLabel = (seniority: SeniorityLevel | null) => {
    if (seniority === null) return 'Any';
    const labels = ['Junior', 'Mid', 'Senior', 'Lead', 'Principal'];
    return labels[seniority] || 'Any';
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shortlist Requests</h1>
          <p className="text-gray-500 mt-1">{totalCount} total requests</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <div className="flex gap-2">
            {['all', 'pending', 'processing', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Shortlists Table */}
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : shortlists.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tech Stack</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seniority</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidates</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {shortlists.map((shortlist) => (
                    <tr key={shortlist.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{shortlist.companyName}</td>
                      <td className="px-4 py-3 text-gray-600">{shortlist.roleTitle}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {shortlist.techStackRequired?.slice(0, 3).map((tech, i) => (
                            <Badge key={i} variant="default">{tech}</Badge>
                          ))}
                          {shortlist.techStackRequired?.length > 3 && (
                            <Badge variant="default">+{shortlist.techStackRequired.length - 3}</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {getSeniorityLabel(shortlist.seniorityRequired)}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-sm">
                        {shortlist.locationPreference || 'Any'}
                        {shortlist.remoteAllowed && (
                          <span className="block text-xs text-green-600">Remote OK</span>
                        )}
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(shortlist.status)}</td>
                      <td className="px-4 py-3 text-gray-600">{shortlist.candidatesCount}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {shortlist.pricePaid ? `$${shortlist.pricePaid}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        {new Date(shortlist.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link href={`/admin/shortlists/${shortlist.id}`}>
                            <Button variant="ghost" size="sm">Review</Button>
                          </Link>
                          {shortlist.status === ShortlistStatus.Pending && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => updateStatus(shortlist.id, ShortlistStatus.Processing)}
                            >
                              Start
                            </Button>
                          )}
                          {shortlist.status === ShortlistStatus.Processing && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => updateStatus(shortlist.id, ShortlistStatus.Completed)}
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4">
                <p className="text-sm text-gray-500">
                  Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-center py-8">No shortlist requests found</p>
        )}
      </Card>
    </div>
  );
}
