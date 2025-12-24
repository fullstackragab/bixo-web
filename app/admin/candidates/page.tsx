'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import api from '@/lib/api';
import { Availability, SeniorityLevel } from '@/types';

interface AdminCandidate {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  desiredRole: string | null;
  availability: Availability;
  seniorityEstimate: SeniorityLevel | null;
  profileVisible: boolean;
  skillsCount: number;
  profileViewsCount: number;
  createdAt: string;
  lastActiveAt: string;
}

interface PaginatedResponse {
  items: AdminCandidate[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function AdminCandidatesPage() {
  const [candidates, setCandidates] = useState<AdminCandidate[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'visible' | 'hidden'>('all');

  useEffect(() => {
    loadCandidates();
  }, [page, filterVisibility]);

  const loadCandidates = async () => {
    setIsLoading(true);
    let url = `/admin/candidates?page=${page}&pageSize=${pageSize}`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
    if (filterVisibility !== 'all') url += `&visible=${filterVisibility === 'visible'}`;

    const res = await api.get<PaginatedResponse>(url);
    if (res.success && res.data) {
      setCandidates(res.data.items);
      setTotalCount(res.data.totalCount);
    }
    setIsLoading(false);
  };

  const handleSearch = () => {
    setPage(1);
    loadCandidates();
  };

  const toggleVisibility = async (candidateId: string, visible: boolean) => {
    const res = await api.put(`/admin/candidates/${candidateId}/visibility`, { visible });
    if (res.success) {
      setCandidates(candidates.map(c =>
        c.id === candidateId ? { ...c, profileVisible: visible } : c
      ));
    }
  };

  const getAvailabilityBadge = (availability: Availability) => {
    switch (availability) {
      case Availability.Open:
        return <Badge variant="success">Open</Badge>;
      case Availability.Passive:
        return <Badge variant="warning">Passive</Badge>;
      case Availability.NotNow:
        return <Badge variant="default">Not Looking</Badge>;
    }
  };

  const getSeniorityLabel = (seniority: SeniorityLevel | null) => {
    if (seniority === null) return '-';
    const labels = ['Junior', 'Mid', 'Senior', 'Lead', 'Principal'];
    return labels[seniority] || '-';
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
          <p className="text-gray-500 mt-1">{totalCount} total candidates</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <Input
              label="Search"
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Name or email..."
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
            <select
              value={filterVisibility}
              onChange={(e) => setFilterVisibility(e.target.value as 'all' | 'visible' | 'hidden')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </Card>

      {/* Candidates Table */}
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : candidates.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seniority</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skills</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visible</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {candidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">
                          {candidate.firstName && candidate.lastName
                            ? `${candidate.firstName} ${candidate.lastName}`
                            : 'No name'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{candidate.email}</td>
                      <td className="px-4 py-3 text-gray-600 text-sm max-w-[200px] truncate">
                        {candidate.desiredRole || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {getSeniorityLabel(candidate.seniorityEstimate)}
                      </td>
                      <td className="px-4 py-3">
                        {getAvailabilityBadge(candidate.availability)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{candidate.skillsCount}</td>
                      <td className="px-4 py-3 text-gray-600">{candidate.profileViewsCount}</td>
                      <td className="px-4 py-3">
                        <Badge variant={candidate.profileVisible ? 'success' : 'default'}>
                          {candidate.profileVisible ? 'Yes' : 'No'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleVisibility(candidate.id, !candidate.profileVisible)}
                          >
                            {candidate.profileVisible ? 'Hide' : 'Show'}
                          </Button>
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
          <p className="text-gray-500 text-center py-8">No candidates found</p>
        )}
      </Card>
    </div>
  );
}
