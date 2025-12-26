import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

export function CandidateProfile() {
  const [isVisible, setIsVisible] = useState(true);
  const completionPercentage = 100; // Achievable without recommendations

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="mb-6">Your profile</h1>
          
          <div className="border border-border rounded-lg p-6 bg-card mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Profile completeness</p>
                <p className="text-2xl text-foreground">{completionPercentage}%</p>
              </div>
              <Badge className="bg-primary text-primary-foreground">Complete</Badge>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>

          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="visibility">Visibility</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {isVisible ? 'Your profile is visible to companies' : 'Your profile is hidden'}
                </p>
              </div>
              <Switch
                id="visibility"
                checked={isVisible}
                onCheckedChange={setIsVisible}
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="mb-1">Senior Frontend Engineer</h3>
                <p className="text-sm text-muted-foreground">8 years experience</p>
              </div>
              <Button variant="outline" className="border-border">Edit</Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">React</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                  <Badge variant="outline">Next.js</Badge>
                  <Badge variant="outline">Node.js</Badge>
                  <Badge variant="outline">GraphQL</Badge>
                  <Badge variant="outline">Team Leadership</Badge>
                </div>
              </div>

              <div>
                <p className="text-sm mb-2">Seniority</p>
                <p className="text-sm text-muted-foreground">Senior / Lead level</p>
              </div>

              <div>
                <p className="text-sm mb-2">Role preferences</p>
                <p className="text-sm text-muted-foreground">
                  Senior frontend role focused on product development, ideally with React. Open to team lead positions. Interested in companies building developer tools or B2B SaaS.
                </p>
              </div>

              <div>
                <p className="text-sm mb-2">Location</p>
                <p className="text-sm text-muted-foreground">Remote, EU timezone preferred</p>
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
              <div className="border border-border rounded-lg p-4 bg-muted/30">
                <p className="text-sm mb-1">Engineering Manager at Previous Company</p>
                <p className="text-xs text-muted-foreground">
                  "Outstanding engineer with strong technical and communication skills. Led the redesign of our core product..."
                </p>
              </div>
              
              <Button variant="outline" className="w-full border-border border-dashed">
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
