import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

type ShortlistState = 'searching' | 'pricing-ready' | 'awaiting-approval' | 'delivered' | 'no-match';

interface ShortlistStatusProps {
  state: ShortlistState;
  onApprove?: () => void;
  onViewCandidates?: () => void;
  pricing?: number;
  candidateCount?: number;
}

export function ShortlistStatus({ 
  state, 
  onApprove, 
  onViewCandidates,
  pricing,
  candidateCount 
}: ShortlistStatusProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {state === 'searching' && (
          <div className="space-y-6">
            <Badge className="bg-accent text-accent-foreground">Searching</Badge>
            <div>
              <h1 className="mb-3">We're curating your shortlist</h1>
              <p className="text-muted-foreground">
                We're reviewing our candidate pool to find the best matches for your role. This typically takes 2–3 business days.
              </p>
            </div>
            <div className="mt-8 p-6 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                We'll email you when action is needed.
              </p>
            </div>
          </div>
        )}

        {state === 'pricing-ready' && (
          <div className="space-y-6">
            <Badge className="bg-accent text-accent-foreground">Pricing ready</Badge>
            <div>
              <h1 className="mb-3">Your shortlist is ready</h1>
              <p className="text-muted-foreground mb-8">
                We've prepared {candidateCount || 3} candidates who meet your requirements. Review the pricing below to continue.
              </p>
              
              <div className="border border-border rounded-lg p-8 bg-card space-y-6">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-muted-foreground mb-1">Shortlist price</p>
                    <p className="text-3xl text-foreground">€{pricing || 2400}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{candidateCount || 3} candidates</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Price is per shortlist delivery. You only pay if we deliver candidates that meet our quality bar.
                  </p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={onApprove}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Approve to continue
            </Button>
            
            <div className="mt-8 p-6 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Last email sent: 2 hours ago
              </p>
            </div>
          </div>
        )}

        {state === 'awaiting-approval' && (
          <div className="space-y-6">
            <Badge className="bg-accent text-accent-foreground">Awaiting approval</Badge>
            <div>
              <h1 className="mb-3">Approval pending</h1>
              <p className="text-muted-foreground">
                We're processing your approval. You'll be able to view candidates shortly.
              </p>
            </div>
            <div className="mt-8 p-6 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                We'll email you when the shortlist is delivered.
              </p>
            </div>
          </div>
        )}

        {state === 'delivered' && (
          <div className="space-y-6">
            <Badge className="bg-primary text-primary-foreground">Delivered</Badge>
            <div>
              <h1 className="mb-3">Your shortlist</h1>
              <p className="text-muted-foreground mb-8">
                {candidateCount || 3} candidates ready for review. Contact details are unlocked.
              </p>
              
              <div className="space-y-4">
                {[1, 2, 3].slice(0, candidateCount || 3).map((i) => (
                  <div key={i} className="border border-border rounded-lg p-6 bg-card">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="mb-1">Senior Frontend Engineer</h3>
                        <p className="text-sm text-muted-foreground">8 years experience</p>
                      </div>
                      <Badge variant="secondary">Available</Badge>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <p className="text-sm text-muted-foreground">
                        Specialized in React and TypeScript. Led teams of 5+ engineers. Strong focus on performance and accessibility.
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">React</Badge>
                        <Badge variant="outline" className="text-xs">TypeScript</Badge>
                        <Badge variant="outline" className="text-xs">Next.js</Badge>
                        <Badge variant="outline" className="text-xs">Leadership</Badge>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm mb-1">Contact</p>
                      <p className="text-sm text-muted-foreground">candidate{i}@email.com</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {state === 'no-match' && (
          <div className="space-y-6">
            <Badge variant="secondary">No suitable candidates found</Badge>
            <div>
              <h1 className="mb-3">No suitable candidates found</h1>
              <p className="text-muted-foreground mb-8">
                We couldn't confidently deliver a shortlist that met our quality bar for this role. This happens occasionally when requirements are very specific or the timing isn't right.
              </p>
              
              <div className="space-y-4">
                <div className="border border-border rounded-lg p-6 bg-card">
                  <h4 className="mb-2">What happens next?</h4>
                  <p className="text-sm text-muted-foreground">
                    You haven't been charged. You can submit a new request anytime, or we can keep this role on file and notify you when suitable candidates become available.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="border-border">
                  Keep on file
                </Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Submit new request
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
