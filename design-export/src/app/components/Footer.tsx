export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <h4 className="mb-4 text-foreground">About</h4>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                About Bixo
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                How it works
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="mb-4 text-foreground">For candidates</h4>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Join as candidate
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="mb-4 text-foreground">For companies</h4>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Request a shortlist
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="mb-4 text-foreground">Legal</h4>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © 2025 Bixo. A human-curated recruitment service.
          </p>
        </div>
      </div>
    </footer>
  );
}
