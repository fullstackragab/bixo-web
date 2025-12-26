import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomePage } from './components/home/HomePage';
import { RequestShortlist } from './components/company/RequestShortlist';
import { ShortlistStatus } from './components/company/ShortlistStatus';
import { CandidateOnboarding } from './components/candidate/CandidateOnboarding';
import { CandidateProfile } from './components/candidate/CandidateProfile';

type Page = 
  | 'home' 
  | 'company-request' 
  | 'company-status-searching'
  | 'company-status-pricing'
  | 'company-status-awaiting'
  | 'company-status-delivered'
  | 'company-status-no-match'
  | 'candidate-onboarding' 
  | 'candidate-profile';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handleCompanySubmit = () => {
    setCurrentPage('company-status-searching');
  };

  const handleApproval = () => {
    setCurrentPage('company-status-awaiting');
    // Simulate approval processing
    setTimeout(() => {
      setCurrentPage('company-status-delivered');
    }, 2000);
  };

  const handleCandidateComplete = () => {
    setCurrentPage('candidate-profile');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage onNavigate={handleNavigate} />
        )}
        
        {currentPage === 'company-request' && (
          <RequestShortlist onSubmit={handleCompanySubmit} />
        )}
        
        {currentPage === 'company-status-searching' && (
          <ShortlistStatus state="searching" />
        )}
        
        {currentPage === 'company-status-pricing' && (
          <ShortlistStatus 
            state="pricing-ready" 
            onApprove={handleApproval}
            pricing={2400}
            candidateCount={3}
          />
        )}
        
        {currentPage === 'company-status-awaiting' && (
          <ShortlistStatus state="awaiting-approval" />
        )}
        
        {currentPage === 'company-status-delivered' && (
          <ShortlistStatus 
            state="delivered"
            candidateCount={3}
          />
        )}
        
        {currentPage === 'company-status-no-match' && (
          <ShortlistStatus state="no-match" />
        )}
        
        {currentPage === 'candidate-onboarding' && (
          <CandidateOnboarding onComplete={handleCandidateComplete} />
        )}
        
        {currentPage === 'candidate-profile' && (
          <CandidateProfile />
        )}
      </main>
      
      <Footer />

      {/* Demo state switcher - for testing different states */}
      <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg p-4 shadow-lg max-w-xs">
        <p className="text-xs text-muted-foreground mb-2">Demo: Switch views</p>
        <div className="space-y-1">
          <button
            onClick={() => setCurrentPage('home')}
            className="w-full text-left text-xs px-2 py-1 rounded hover:bg-accent transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => setCurrentPage('company-request')}
            className="w-full text-left text-xs px-2 py-1 rounded hover:bg-accent transition-colors"
          >
            Company: Request
          </button>
          <button
            onClick={() => setCurrentPage('company-status-pricing')}
            className="w-full text-left text-xs px-2 py-1 rounded hover:bg-accent transition-colors"
          >
            Company: Pricing Ready
          </button>
          <button
            onClick={() => setCurrentPage('company-status-delivered')}
            className="w-full text-left text-xs px-2 py-1 rounded hover:bg-accent transition-colors"
          >
            Company: Delivered
          </button>
          <button
            onClick={() => setCurrentPage('company-status-no-match')}
            className="w-full text-left text-xs px-2 py-1 rounded hover:bg-accent transition-colors"
          >
            Company: No Match
          </button>
          <button
            onClick={() => setCurrentPage('candidate-onboarding')}
            className="w-full text-left text-xs px-2 py-1 rounded hover:bg-accent transition-colors"
          >
            Candidate: Onboarding
          </button>
          <button
            onClick={() => setCurrentPage('candidate-profile')}
            className="w-full text-left text-xs px-2 py-1 rounded hover:bg-accent transition-colors"
          >
            Candidate: Profile
          </button>
        </div>
      </div>
    </div>
  );
}
