import { Button } from '../ui/button';

export function HomePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="mb-6 text-4xl">
          Human-curated recruitment for serious companies
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          No job boards. No applications. No spam. We connect companies with pre-vetted candidates through curated shortlists.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => onNavigate('candidate-onboarding')}
            variant="outline"
            className="border-border"
          >
            Join as a candidate
          </Button>
          <Button 
            onClick={() => onNavigate('company-request')}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Request a shortlist
          </Button>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-5xl mx-auto px-6 py-24 border-t border-border">
        <div className="text-center mb-16">
          <h2 className="mb-4">How it works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A simple, outcome-driven process designed to save time and respect everyone involved.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-primary">1</span>
            </div>
            <h4>Company requests a shortlist</h4>
            <p className="text-sm text-muted-foreground">
              Describe the role and requirements. No job posting needed.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-primary">2</span>
            </div>
            <h4>We curate candidates</h4>
            <p className="text-sm text-muted-foreground">
              Our team manually reviews candidates and prepares a shortlist with pricing.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-primary">3</span>
            </div>
            <h4>Company reviews & approves</h4>
            <p className="text-sm text-muted-foreground">
              See pricing only after we've prepared value. Approve to unlock contacts.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-primary">4</span>
            </div>
            <h4>Introductions are made</h4>
            <p className="text-sm text-muted-foreground">
              Contact details unlocked. Take it from there.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 border-t border-border">
        <div className="text-center mb-16">
          <h2 className="mb-4">Our principles</h2>
        </div>

        <div className="space-y-8">
          <div className="border border-border rounded-lg p-8 bg-card">
            <h3 className="mb-3">No applications</h3>
            <p className="text-muted-foreground">
              Candidates don't apply to jobs. We introduce them only when there's a genuine match, based on our manual review.
            </p>
          </div>

          <div className="border border-border rounded-lg p-8 bg-card">
            <h3 className="mb-3">No spam</h3>
            <p className="text-muted-foreground">
              We never share candidate details until a company has approved pricing. Candidates control their visibility at all times.
            </p>
          </div>

          <div className="border border-border rounded-lg p-8 bg-card">
            <h3 className="mb-3">Candidates are free</h3>
            <p className="text-muted-foreground">
              Creating a profile and being matched is completely free for candidates. Always.
            </p>
          </div>

          <div className="border border-border rounded-lg p-8 bg-card">
            <h3 className="mb-3">Companies pay only for outcomes</h3>
            <p className="text-muted-foreground">
              Companies see pricing only after we've prepared a shortlist. If we can't deliver candidates who meet our quality bar, there's no charge.
            </p>
          </div>
        </div>
      </section>

      {/* For Candidates Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 border-t border-border">
        <div className="text-center">
          <h2 className="mb-4">For candidates</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create a profile once. We'll reach out only when there's a role that genuinely fits.
          </p>
          <Button 
            onClick={() => onNavigate('candidate-onboarding')}
            variant="outline"
            className="border-border"
          >
            Join as a candidate
          </Button>
        </div>
      </section>

      {/* For Companies Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 border-t border-border">
        <div className="text-center">
          <h2 className="mb-4">For companies</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Skip the job board noise. Get a curated shortlist of candidates who actually match your needs.
          </p>
          <Button 
            onClick={() => onNavigate('company-request')}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Request a shortlist
          </Button>
        </div>
      </section>
    </div>
  );
}
