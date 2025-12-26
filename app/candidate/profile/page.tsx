'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import api from '@/lib/api';
import { CandidateProfile } from '@/types';

function Badge({
  children,
  variant = 'default'
}: {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'primary';
}) {
  const baseClasses = 'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium';
  const variantClasses = {
    default: 'bg-accent text-accent-foreground',
    outline: 'border border-border bg-transparent',
    primary: 'bg-primary text-primary-foreground',
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
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline';
  className?: string;
}) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-border bg-card hover:bg-accent hover:text-accent-foreground',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
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

export default function CandidateProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      loadProfile();
    }
  }, [authLoading, user]);

  const loadProfile = async () => {
    setIsLoading(true);
    const res = await api.get<CandidateProfile>('/candidates/profile');
    if (res.success && res.data) {
      setProfile(res.data);
      setIsVisible(res.data.profileVisible);
    }
    setIsLoading(false);
  };

  const handleVisibilityChange = async (visible: boolean) => {
    setIsVisible(visible);
    await api.put('/candidates/profile', {
      profileVisible: visible
    });
  };

  const handleEdit = () => {
    // Could navigate to an edit page, or open a modal
    // For now, just reload
    window.location.href = '/candidate/profile/edit';
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

  const skills = profile?.skills?.map(s => s.skillName) || ['React', 'TypeScript', 'Next.js', 'Node.js', 'GraphQL', 'Team Leadership'];
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
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="mb-1">{profile?.desiredRole || 'Senior Frontend Engineer'}</h3>
                <p className="text-sm text-muted-foreground">{yearsExperience} years experience</p>
              </div>
              <Button variant="outline" onClick={handleEdit}>Edit</Button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {skills.slice(0, 8).map((skill, i) => (
                    <Badge key={i} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm mb-2">Seniority</p>
                <p className="text-sm text-muted-foreground">{seniority}</p>
              </div>

              <div>
                <p className="text-sm mb-2">Role preferences</p>
                <p className="text-sm text-muted-foreground">
                  {rolePreferences}
                </p>
              </div>

              <div>
                <p className="text-sm mb-2">Location</p>
                <p className="text-sm text-muted-foreground">{locationText}</p>
              </div>
            </div>
          </div>

          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="mb-1">Recommendations</h3>
                <p className="text-sm text-muted-foreground">Optional but helpful for companies</p>
              </div>
            </div>

            <div className="space-y-3">
              {profile?.recommendationsCount && profile.recommendationsCount > 0 ? (
                <div className="border border-border rounded-lg p-4 bg-muted/30">
                  <p className="text-sm mb-1">Engineering Manager at Previous Company</p>
                  <p className="text-xs text-muted-foreground">
                    "Outstanding engineer with strong technical and communication skills. Led the redesign of our core product..."
                  </p>
                </div>
              ) : null}

              <Button variant="outline" className="w-full border-dashed">
                Request recommendation
              </Button>
            </div>
          </div>

          <div className="border border-border rounded-lg p-6 bg-muted">
            <h4 className="mb-2">How matching works</h4>
            <p className="text-sm text-muted-foreground">
              Companies request shortlists for specific roles. We review candidates manually and introduce you only if there's a strong match. You'll never see job posts or need to apply.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
