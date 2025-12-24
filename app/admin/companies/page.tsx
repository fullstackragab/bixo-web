'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import api from '@/lib/api';
import { SubscriptionTier } from '@/types';

interface AdminCompany {
  id: string;
  userId: string;
  companyName: string;
  email: string;
  industry: string | null;
  companySize: string | null;
  website: string | null;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt: string | null;
  messagesRemaining: number;
  shortlistsCount: number;
  savedCandidatesCount: number;
  createdAt: string;
  lastActiveAt: string;
}

interface PaginatedResponse {
  items: AdminCompany[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<'all' | 'free' | 'starter' | 'pro'>('all');

  useEffect(() => {
    loadCompanies();
  }, [page, filterTier]);

  const loadCompanies = async () => {
    setIsLoading(true);
    let url = `/admin/companies?page=${page}&pageSize=${pageSize}`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
    if (filterTier !== 'all') {
      const tierValue = filterTier === 'free' ? 0 : filterTier === 'starter' ? 1 : 2;
      url += `&tier=${tierValue}`;
    }

    const res = await api.get<PaginatedResponse>(url);
    if (res.success && res.data) {
      setCompanies(res.data.items);
      setTotalCount(res.data.totalCount);
    }
    setIsLoading(false);
  };

  const handleSearch = () => {
    setPage(1);
    loadCompanies();
  };

  const updateMessages = async (companyId: string, messages: number) => {
    const res = await api.put(`/admin/companies/${companyId}/messages`, { messagesRemaining: messages });
    if (res.success) {
      setCompanies(companies.map(c =>
        c.id === companyId ? { ...c, messagesRemaining: messages } : c
      ));
    }
  };

  const getSubscriptionBadge = (tier: SubscriptionTier) => {
    switch (tier) {
      case SubscriptionTier.Free:
        return <Badge variant="default">Free</Badge>;
      case SubscriptionTier.Starter:
        return <Badge variant="primary">Starter</Badge>;
      case SubscriptionTier.Pro:
        return <Badge variant="success">Pro</Badge>;
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-500 mt-1">{totalCount} total companies</p>
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
              placeholder="Company name or email..."
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subscription</label>
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value as 'all' | 'free' | 'starter' | 'pro')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="free">Free</option>
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
            </select>
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </Card>

      {/* Companies Table */}
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : companies.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscription</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Messages</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shortlists</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Saved</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {companies.map((company) => (
                    <tr key={company.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-medium text-gray-900">{company.companyName}</span>
                          {company.website && (
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-xs text-blue-600 hover:underline truncate max-w-[150px]"
                            >
                              {company.website}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{company.email}</td>
                      <td className="px-4 py-3 text-gray-600">{company.industry || '-'}</td>
                      <td className="px-4 py-3">{getSubscriptionBadge(company.subscriptionTier)}</td>
                      <td className="px-4 py-3 text-gray-600 text-sm">
                        {company.subscriptionExpiresAt
                          ? new Date(company.subscriptionExpiresAt).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900 font-medium">{company.messagesRemaining}</span>
                          <button
                            onClick={() => {
                              const newValue = prompt('Set messages remaining:', String(company.messagesRemaining));
                              if (newValue !== null) {
                                const num = parseInt(newValue);
                                if (!isNaN(num) && num >= 0) {
                                  updateMessages(company.id, num);
                                }
                              }
                            }}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{company.shortlistsCount}</td>
                      <td className="px-4 py-3 text-gray-600">{company.savedCandidatesCount}</td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm">View</Button>
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
          <p className="text-gray-500 text-center py-8">No companies found</p>
        )}
      </Card>
    </div>
  );
}
