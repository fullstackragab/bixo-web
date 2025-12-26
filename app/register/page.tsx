'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-base font-medium text-foreground mb-2">
      {children}
    </label>
  );
}

function Input({
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  minLength,
}: {
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  minLength?: number;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      minLength={minLength}
      className="w-full px-3 py-2 bg-input-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
    />
  );
}

function Button({
  children,
  type = 'button',
  disabled = false,
}: {
  children: React.ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="w-full inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
    >
      {children}
    </button>
  );
}

type AccountType = 'candidate' | 'company';

function RegisterContent() {
  const searchParams = useSearchParams();
  const { registerCandidate, registerCompany } = useAuth();

  const [accountType, setAccountType] = useState<AccountType>('candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'company') {
      setAccountType('company');
    } else if (type === 'candidate') {
      setAccountType('candidate');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    let result;
    if (accountType === 'candidate') {
      result = await registerCandidate(email, password, firstName, lastName);
    } else {
      result = await registerCompany(email, password, companyName, industry);
    }

    if (!result.success) {
      setError(result.error || 'Registration failed');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="hover:opacity-70 transition-opacity">
            <Image
              src="/logo+name.png"
              alt="Bixo"
              width={80}
              height={32}
              priority
            />
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="mb-3">Create an account</h1>
            <p className="text-muted-foreground">
              {accountType === 'candidate'
                ? 'Join Bixo to be matched with curated opportunities.'
                : 'Start receiving curated shortlists for your roles.'}
            </p>
          </div>

          <div className="border border-border rounded-lg p-8 bg-card">
            {/* Account Type Toggle */}
            <div className="flex rounded-lg bg-muted p-1 mb-6">
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  accountType === 'candidate'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setAccountType('candidate')}
              >
                Candidate
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  accountType === 'company'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setAccountType('company')}
              >
                Company
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  autoComplete="new-password"
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">At least 8 characters</p>
              </div>

              {accountType === 'candidate' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      required
                      autoComplete="given-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      required
                      autoComplete="family-name"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company name</Label>
                    <Input
                      id="companyName"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Acme Inc."
                      required
                      autoComplete="organization"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="Technology, Finance, etc."
                      required
                    />
                  </div>
                </>
              )}

              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? 'Creating account...'
                  : accountType === 'candidate'
                  ? 'Create account'
                  : 'Get started'}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="underline hover:text-foreground">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline hover:text-foreground">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-foreground hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
