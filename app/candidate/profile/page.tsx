'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import RequestRecommendationModal from '@/components/RequestRecommendationModal';
import CapabilitiesDisplay from '@/components/CapabilitiesDisplay';
import api from '@/lib/api';
import { deriveCapabilities } from '@/lib/capabilities';
import { CandidateProfile, CandidateRecommendation, Capabilities } from '@/types';

function Badge({
  children,
  variant = 'default'
}: {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
}) {
  const baseClasses = 'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium';
  const variantClasses = {
    default: 'bg-accent text-accent-foreground',
    outline: 'border border-border bg-transparent',
    primary: 'bg-primary text-primary-foreground',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}

function Button({
  children,
  onClick,
  variant = 'default',
  size = 'default',
  className = '',
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'danger';
  size?: 'default' | 'sm';
  className?: string;
  disabled?: boolean;
}) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed';
  const sizeClasses = {
    default: 'px-4 py-2 text-sm',
    sm: 'px-3 py-1.5 text-xs',
  };
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-border bg-card hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function Switch({
  id,
  checked,
  onCheckedChange,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-primary' : 'bg-switch-background'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

function Progress({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`w-full bg-muted rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-primary transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function getRecommendationStatusBadge(rec: CandidateRecommendation) {
  if (rec.isRejected) {
    return <Badge variant="danger">Rejected</Badge>;
  }
  if (rec.isAdminApproved) {
    return <Badge variant="success">Visible to companies</Badge>;
  }
  if (rec.isApprovedByCandidate) {
    return <Badge variant="info">Pending admin review</Badge>;
  }
  if (rec.isSubmitted) {
    return <Badge variant="warning">Needs your approval</Badge>;
  }
  return <Badge variant="default">Awaiting submission</Badge>;
}

export default function CandidateProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [recommendations, setRecommendations] = useState<CandidateRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      loadData();
    }
  }, [authLoading, user]);

  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([loadProfile(), loadRecommendations()]);
    setIsLoading(false);
  };

  const loadProfile = async () => {
    const res = await api.get<CandidateProfile>('/candidates/profile');
    if (res.success && res.data) {
      setProfile(res.data);
      setIsVisible(res.data.profileVisible);
    }
  };

  const loadRecommendations = async () => {
    const res = await api.get<CandidateRecommendation[]>('/candidates/me/recommendations');
    if (res.success && res.data) {
      setRecommendations(res.data);
    }
  };

  const handleVisibilityChange = async (visible: boolean) => {
    setIsVisible(visible);
    await api.put('/candidates/profile', {
      profileVisible: visible
    });
  };

  const handleEdit = () => {
    window.location.href = '/candidate/profile/edit';
  };

  const handleApproveRecommendation = async (id: string) => {
    setActionLoading(id);
    const res = await api.post(`/candidates/me/recommendations/${id}/approve`);
    if (res.success) {
      await loadRecommendations();
    }
    setActionLoading(null);
  };

  const handleDeleteRecommendation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recommendation?')) return;
    setActionLoading(id);
    const res = await api.delete(`/candidates/me/recommendations/${id}`);
    if (res.success) {
      await loadRecommendations();
    }
    setActionLoading(null);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Calculate profile completeness
  const completionPercentage = profile ? Math.min(100, Math.round(
    ((profile.firstName ? 20 : 0) +
    (profile.lastName ? 20 : 0) +
    (profile.desiredRole ? 20 : 0) +
    (profile.skills && profile.skills.length > 0 ? 20 : 0) +
    (profile.cvFileName ? 20 : 0)) || 0
  )) : 0;

  // Derive capabilities from skills (backend provides or we derive)
  const capabilities: Capabilities = profile?.capabilities ||
    (profile?.skills ? deriveCapabilities(profile.skills) : {});

  const seniority = profile?.seniorityEstimate || 'Senior / Lead level';
  const rolePreferences = profile?.desiredRole || 'Senior frontend role focused on product development, ideally with React. Open to team lead positions. Interested in companies building developer tools or B2B SaaS.';
  const locationText = profile?.locationPreference || 'Remote, EU timezone preferred';
  const yearsExperience = 8;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="mb-6">Your profile</h1>

          <div className="border border-border rounded-lg p-6 bg-card mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Profile completeness</p>
                <p className="text-2xl text-foreground">{completionPercentage}%</p>
              </div>
              <Badge variant={completionPercentage === 100 ? 'primary' : 'default'}>
                {completionPercentage === 100 ? 'Complete' : 'In progress'}
              </Badge>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>

          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="visibility" className="block text-base font-medium text-foreground">Visibility</label>
                <p className="text-sm text-muted-foreground mt-1">
                  {isVisible ? 'Your profile is visible to companies' : 'Your profile is hidden'}
                </p>
              </div>
              <Switch
                id="visibility"
                checked={isVisible}
                onCheckedChange={handleVisibilityChange}
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Profile Card */}
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="mb-1">{profile?.desiredRole || 'Senior Frontend Engineer'}</h3>
                <p className="text-sm text-muted-foreground">{yearsExperience} years experience</p>
              </div>
              <Button variant="outline" onClick={handleEdit}>Edit</Button>
            </div>

            <div className="space-y-6">
              {/* Capabilities - Editorial display of skills */}
              <div>
                <p className="text-sm font-medium mb-3">Capabilities</p>
                <CapabilitiesDisplay capabilities={capabilities} />
                <p className="text-xs text-muted-foreground mt-3 italic">
                  We organize your skills into capabilities to help companies understand your experience more clearly.
                </p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Seniority</p>
                <p className="text-sm text-muted-foreground">{seniority}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Role preferences</p>
                <p className="text-sm text-muted-foreground">
                  {rolePreferences}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Location</p>
                <p className="text-sm text-muted-foreground">{locationText}</p>
              </div>
            </div>
          </div>

          {/* Recommendations Card */}
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="mb-1">Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  {recommendations.length}/3 recommendations
                </p>
              </div>
            </div>

            {/* Privacy note */}
            <div className="bg-muted/50 rounded-lg p-3 mb-4">
              <p className="text-xs text-muted-foreground">
                Recommendations are private and shared only with your permission.
              </p>
            </div>

            {/* Recommendations list */}
            <div className="space-y-4">
              {recommendations.length > 0 ? (
                recommendations.map((rec) => (
                  <div key={rec.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm">{rec.recommenderName}</p>
                        <p className="text-xs text-muted-foreground">
                          {rec.relationship}
                          {rec.recommenderCompany && ` at ${rec.recommenderCompany}`}
                        </p>
                      </div>
                      {getRecommendationStatusBadge(rec)}
                    </div>

                    {/* Content preview for submitted recommendations */}
                    {rec.isSubmitted && rec.content && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                        &ldquo;{rec.content}&rdquo;
                      </p>
                    )}

                    {/* Rejection reason */}
                    {rec.isRejected && rec.rejectionReason && (
                      <p className="text-sm text-red-600 mt-2">
                        Reason: {rec.rejectionReason}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                      {/* Show approve button only if submitted but not yet approved */}
                      {rec.isSubmitted && !rec.isApprovedByCandidate && !rec.isRejected && (
                        <Button
                          size="sm"
                          onClick={() => handleApproveRecommendation(rec.id)}
                          disabled={actionLoading === rec.id}
                        >
                          {actionLoading === rec.id ? 'Approving...' : 'Approve'}
                        </Button>
                      )}

                      {/* Delete button (always available unless admin approved) */}
                      {!rec.isAdminApproved && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteRecommendation(rec.id)}
                          disabled={actionLoading === rec.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recommendations yet. Request one from your professional network.
                </p>
              )}

              {/* Request button */}
              <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={() => setShowRequestModal(true)}
                disabled={recommendations.length >= 3}
              >
                {recommendations.length >= 3 ? 'Maximum 3 recommendations reached' : 'Request recommendation'}
              </Button>
            </div>
          </div>

          {/* How matching works */}
          <div className="border border-border rounded-lg p-6 bg-muted">
            <h4 className="mb-2">How matching works</h4>
            <p className="text-sm text-muted-foreground">
              Companies request shortlists for specific roles. We review candidates manually and introduce you only if there&apos;s a strong match. You&apos;ll never see job posts or need to apply.
            </p>
          </div>
        </div>
      </div>

      {/* Request Recommendation Modal */}
      <RequestRecommendationModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSuccess={() => loadRecommendations()}
        currentCount={recommendations.length}
      />
    </div>
  );
}
