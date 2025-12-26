import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Upload } from 'lucide-react';

export function CandidateOnboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    cvFile: null as File | null,
    linkedinUrl: '',
    rolePreference: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, cvFile: e.target.files[0] });
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  i <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Step {step} of 3</p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="mb-3">Upload your CV or LinkedIn</h1>
              <p className="text-muted-foreground">
                We'll use this to understand your background. You can refine your profile later.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cv">CV / Resume</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="cv"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="cv" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                    {formData.cvFile ? (
                      <p className="text-sm text-foreground">{formData.cvFile.name}</p>
                    ) : (
                      <>
                        <p className="text-sm text-foreground mb-1">Click to upload</p>
                        <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn profile URL</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="bg-input-background border-border"
                />
              </div>
            </div>

            <Button
              onClick={handleNext}
              disabled={!formData.cvFile && !formData.linkedinUrl}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="mb-3">What kind of role are you looking for?</h1>
              <p className="text-muted-foreground">
                Be as specific or broad as you like. This helps us match you with relevant opportunities.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rolePreference">Role preference</Label>
              <Textarea
                id="rolePreference"
                value={formData.rolePreference}
                onChange={(e) => setFormData({ ...formData, rolePreference: e.target.value })}
                placeholder="e.g., Senior frontend role focused on product development, ideally with React. Open to team lead positions."
                className="min-h-32 bg-input-background border-border"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="border-border"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!formData.rolePreference}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="mb-3">Set your visibility</h1>
              <p className="text-muted-foreground">
                You can change this anytime from your profile.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleNext}
                className="w-full border border-border rounded-lg p-6 text-left bg-card hover:bg-accent/50 transition-colors"
              >
                <h4 className="mb-2">Open to opportunities</h4>
                <p className="text-sm text-muted-foreground">
                  Your profile will be visible to companies requesting shortlists.
                </p>
              </button>

              <button
                onClick={handleNext}
                className="w-full border border-border rounded-lg p-6 text-left bg-card hover:bg-accent/50 transition-colors"
              >
                <h4 className="mb-2">Not looking right now</h4>
                <p className="text-sm text-muted-foreground">
                  Your profile will be hidden. You can activate it when ready.
                </p>
              </button>
            </div>

            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="border-border"
            >
              Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
