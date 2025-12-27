'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { RecommenderFormData, SubmitRecommendationRequest } from '@/types';

type PageState = 'loading' | 'form' | 'already-submitted' | 'success' | 'error';

export default function RecommenderFormPage() {
  const params = useParams();
  const token = params.token as string;

  const [pageState, setPageState] = useState<PageState>('loading');
  const [formData, setFormData] = useState<RecommenderFormData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Form fields
  const [content, setContent] = useState('');
  const [recommenderRole, setRecommenderRole] = useState('');
  const [recommenderCompany, setRecommenderCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    loadFormData();
  }, [token]);

  const loadFormData = async () => {
    const res = await api.get<RecommenderFormData>(`/recommendations/${token}`);

    if (res.success && res.data) {
      setFormData(res.data);
      if (res.data.isAlreadySubmitted) {
        setPageState('already-submitted');
      } else {
        setPageState('form');
      }
    } else {
      setErrorMessage(res.error || 'Invalid or expired recommendation link');
      setPageState('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!content.trim()) {
      setFormError('Please write your recommendation');
      return;
    }

    if (content.trim().length < 50) {
      setFormError('Recommendation should be at least 50 characters');
      return;
    }

    setIsSubmitting(true);

    const request: SubmitRecommendationRequest = {
      content: content.trim(),
      recommenderRole: recommenderRole.trim() || undefined,
      recommenderCompany: recommenderCompany.trim() || undefined,
    };

    const res = await api.post(`/recommendations/${token}/submit`, request);

    if (res.success) {
      setPageState('success');
    } else {
      setFormError(res.error || 'Failed to submit recommendation. Please try again.');
    }

    setIsSubmitting(false);
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  // Loading state
  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Link Not Valid</h1>
          <p className="text-gray-600">{errorMessage}</p>
        </div>
      </div>
    );
  }

  // Already submitted state
  if (pageState === 'already-submitted') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Already Submitted</h1>
          <p className="text-gray-600">
            You have already submitted a recommendation for {formData?.candidateName}.
          </p>
          {formData?.submittedAt && (
            <p className="text-sm text-gray-500 mt-2">
              Submitted on {new Date(formData.submittedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Success state
  if (pageState === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Thank You</h1>
          <p className="text-gray-600">
            Your recommendation has been submitted successfully. {formData?.candidateName} will be notified.
          </p>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Write a Recommendation
          </h1>
          <p className="text-gray-600">
            for <span className="font-medium text-gray-900">{formData?.candidateName}</span>
          </p>
          {formData?.relationship && (
            <p className="text-sm text-gray-500 mt-1">
              Relationship: {formData.relationship}
            </p>
          )}
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Your Recommendation
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe your experience working with this person. What are their key strengths? What kind of work did you do together?"
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                disabled={isSubmitting}
              />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>{wordCount} words</span>
                <span>Aim for 100-300 words</span>
              </div>
            </div>

            {/* Optional fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Role <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  id="role"
                  type="text"
                  value={recommenderRole}
                  onChange={(e) => setRecommenderRole(e.target.value)}
                  placeholder="e.g., Engineering Manager"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  id="company"
                  type="text"
                  value={recommenderCompany}
                  onChange={(e) => setRecommenderCompany(e.target.value)}
                  placeholder="e.g., TechCorp Inc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Privacy note */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                This recommendation is private. It will only be shared with companies if {formData?.candidateName} chooses to make it visible.
              </p>
            </div>

            {/* Error message */}
            {formError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{formError}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Recommendation'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Powered by <span className="font-medium">Bixo</span>
          </p>
        </div>
      </div>
    </div>
  );
}
