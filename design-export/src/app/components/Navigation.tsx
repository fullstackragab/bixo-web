export function Navigation({ currentPage, onNavigate }: { currentPage: string; onNavigate: (page: string) => void }) {
  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate('home')}
            className="hover:opacity-70 transition-opacity"
          >
            <span className="text-xl text-foreground">Bixo</span>
          </button>
          
          <div className="flex items-center gap-8">
            <button 
              onClick={() => onNavigate('home')}
              className={`text-sm hover:text-foreground transition-colors ${
                currentPage === 'home' ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              How it works
            </button>
            <button 
              onClick={() => onNavigate('candidate-onboarding')}
              className={`text-sm hover:text-foreground transition-colors ${
                currentPage.startsWith('candidate') ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              For candidates
            </button>
            <button 
              onClick={() => onNavigate('company-request')}
              className={`text-sm hover:text-foreground transition-colors ${
                currentPage.startsWith('company') ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              For companies
            </button>
            <button 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </button>
            <button 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
