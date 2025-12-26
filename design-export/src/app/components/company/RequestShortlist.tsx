import { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function RequestShortlist({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    roleDescription: '',
    techStack: '',
    seniority: '',
    locationPreference: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="mb-3">Request a shortlist</h1>
          <p className="text-muted-foreground">
            Tell us what you're looking for. We'll curate a shortlist of candidates and present pricing once we've prepared it.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="roleDescription">Role description</Label>
            <Textarea
              id="roleDescription"
              value={formData.roleDescription}
              onChange={(e) => setFormData({ ...formData, roleDescription: e.target.value })}
              placeholder="Describe the role, responsibilities, and what success looks like..."
              className="min-h-32 bg-input-background border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="techStack">Tech stack (optional)</Label>
            <Input
              id="techStack"
              value={formData.techStack}
              onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
              placeholder="e.g., React, TypeScript, Node.js"
              className="bg-input-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seniority">Seniority level</Label>
            <Input
              id="seniority"
              value={formData.seniority}
              onChange={(e) => setFormData({ ...formData, seniority: e.target.value })}
              placeholder="e.g., Senior, Lead, Principal"
              className="bg-input-background border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationPreference">Location preference (optional)</Label>
            <Input
              id="locationPreference"
              value={formData.locationPreference}
              onChange={(e) => setFormData({ ...formData, locationPreference: e.target.value })}
              placeholder="e.g., EU timezone, Remote anywhere"
              className="bg-input-background border-border"
            />
            <p className="text-sm text-muted-foreground">This is a soft preference, not a requirement.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any other context that would help us find the right candidates..."
              className="min-h-24 bg-input-background border-border"
            />
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Submit request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
