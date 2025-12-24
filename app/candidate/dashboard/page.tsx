'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { CandidateProfile, Notification, Availability } from '@/types';

export default function CandidateDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      loadData();
    }
  }, [authLoading, user]);

  const loadData = async () => {
    setIsLoading(true);
    const [profileRes, notificationsRes] = await Promise.all([
      api.get<CandidateProfile>('/candidates/profile'),
      api.get<Notification[]>('/candidates/notifications')
    ]);

    if (profileRes.success && profileRes.data) {
      setProfile(profileRes.data);
    }
    if (notificationsRes.success && notificationsRes.data) {
      setNotifications(notificationsRes.data.slice(0, 5));
    }
    setIsLoading(false);
  };

  const getAvailabilityBadge = (availability: Availability) => {
    switch (availability) {
      case Availability.Open:
        return <Badge variant="success">Actively Looking</Badge>;
      case Availability.Passive:
        return <Badge variant="warning">Open to Opportunities</Badge>;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back{profile?.firstName ? `, ${profile.firstName}` : ''}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here&apos;s what&apos;s happening with your profile
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats */}
          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Profile Views</p>
                <p className="text-2xl font-bold text-gray-900">{profile?.profileViewsCount || 0}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Skills</p>
                <p className="text-2xl font-bold text-gray-900">{profile?.skills.length || 0}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Recommendations</p>
                <p className="text-2xl font-bold text-gray-900">{profile?.recommendationsCount || 0}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Profile Summary */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Profile Summary</h2>
              <Link href="/candidate/profile">
                <Button variant="outline" size="sm">Edit Profile</Button>
              </Link>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                {profile && getAvailabilityBadge(profile.availability)}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Visibility</span>
                <Badge variant={profile?.profileVisible ? 'success' : 'default'}>
                  {profile?.profileVisible ? 'Visible to Companies' : 'Hidden'}
                </Badge>
              </div>

              {profile?.desiredRole && (
                <div>
                  <span className="text-gray-600 block text-sm">Desired Role</span>
                  <span className="font-medium">{profile.desiredRole}</span>
                </div>
              )}

              {profile?.skills && profile.skills.length > 0 && (
                <div>
                  <span className="text-gray-600 block text-sm mb-2">Top Skills</span>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.slice(0, 5).map((skill) => (
                      <Badge key={skill.id} variant="primary">{skill.skillName}</Badge>
                    ))}
                    {profile.skills.length > 5 && (
                      <Badge variant="default">+{profile.skills.length - 5} more</Badge>
                    )}
                  </div>
                </div>
              )}

              {!profile?.cvFileName && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    Upload your CV to get discovered by companies and let us extract your skills automatically.
                  </p>
                  <Link href="/candidate/profile">
                    <Button size="sm" className="mt-2">Upload CV</Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
              <Link href="/candidate/notifications" className="text-sm text-blue-600 hover:text-blue-700">
                View all
              </Link>
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg ${notification.isRead ? 'bg-gray-50' : 'bg-blue-50'}`}
                  >
                    <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                    {notification.message && (
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No notifications yet</p>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
