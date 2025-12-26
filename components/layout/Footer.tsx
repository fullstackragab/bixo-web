'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="mb-4 text-foreground">About</h4>
            <div className="space-y-2">
              <Link
                href="/"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About Bixo
              </Link>
              <Link
                href="/#how-it-works"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                How it works
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-foreground">For candidates</h4>
            <div className="space-y-2">
              <Link
                href="/register?type=candidate"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Join as candidate
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-foreground">For companies</h4>
            <div className="space-y-2">
              <Link
                href="/register?type=company"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Request a shortlist
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-foreground">Legal</h4>
            <div className="space-y-2">
              <Link
                href="/terms"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/support"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Bixo. A human-curated recruitment service.
          </p>
        </div>
      </div>
    </footer>
  );
}
