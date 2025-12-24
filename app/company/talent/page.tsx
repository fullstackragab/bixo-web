"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import api from "@/lib/api";
import {
  SeniorityLevel,
  Availability,
  TalentCandidate,
  TalentSearchResult,
} from "@/types";

export default function CompanyTalentPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [candidates, setCandidates] = useState<TalentCandidate[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [skillFilter, setSkillFilter] = useState("");
  const [seniorityFilter, setSeniorityFilter] = useState<string>("");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("");

  // Track applied filters separately to avoid stale closures
  const [appliedFilters, setAppliedFilters] = useState({
    skills: "",
    seniority: "",
    availability: "",
  });

  const loadCandidates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    let url = `/companies/talent?page=${page}&pageSize=20`;
    if (appliedFilters.skills)
      url += `&skills=${encodeURIComponent(appliedFilters.skills)}`;
    if (appliedFilters.seniority)
      url += `&seniority=${appliedFilters.seniority}`;
    if (appliedFilters.availability)
      url += `&availability=${appliedFilters.availability}`;

    try {
      const res = await api.get<TalentSearchResult>(url);
      if (res.success && res.data) {
        setCandidates(res.data.candidates);
        setTotalCount(res.data.totalCount);
      } else {
        setError(res.error || "Failed to load candidates");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [page, appliedFilters]);

  useEffect(() => {
    if (!authLoading && user) {
      loadCandidates();
    }
  }, [authLoading, user, loadCandidates]);

  const handleSearch = () => {
    setPage(1);
    setAppliedFilters({
      skills: skillFilter,
      seniority: seniorityFilter,
      availability: availabilityFilter,
    });
  };

  const toggleSave = async (candidateId: string, currentlySaved: boolean) => {
    // Optimistically update UI
    setCandidates((prev) =>
      prev.map((c) =>
        c.candidateId === candidateId ? { ...c, isSaved: !currentlySaved } : c
      )
    );

    try {
      let res;
      if (currentlySaved) {
        res = await api.delete(`/companies/candidates/save/${candidateId}`);
      } else {
        res = await api.post("/companies/candidates/save", { candidateId });
      }

      if (!res.success) {
        // Revert on failure
        setCandidates((prev) =>
          prev.map((c) =>
            c.candidateId === candidateId ? { ...c, isSaved: currentlySaved } : c
          )
        );
        setError(res.error || "Failed to save candidate");
      }
    } catch {
      // Revert on error
      setCandidates((prev) =>
        prev.map((c) =>
          c.candidateId === candidateId ? { ...c, isSaved: currentlySaved } : c
        )
      );
      setError("Failed to save candidate");
    }
  };

  const getSeniorityLabel = (seniority: SeniorityLevel | null | undefined) => {
    if (seniority === null || seniority === undefined) return null;
    const labels = ["Junior", "Mid", "Senior", "Lead", "Principal"];
    return labels[seniority];
  };

  const getAvailabilityBadge = (availability: Availability) => {
    switch (availability) {
      case Availability.Open:
        return <Badge variant="success">Actively Looking</Badge>;
      case Availability.Passive:
        return <Badge variant="warning">Open to Opportunities</Badge>;
      case Availability.NotNow:
        return <Badge variant="default">Not Looking</Badge>;
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Browse Talent</h1>
            <p className="text-gray-500 mt-1">
              {totalCount} candidates available
            </p>
          </div>
          <Link href="/company/shortlists">
            <Button>Request Shortlist</Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <Input
                label="Skills"
                id="skills"
                type="text"
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                placeholder="React, Python, AWS..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seniority
              </label>
              <select
                value={seniorityFilter}
                onChange={(e) => setSeniorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Any</option>
                <option value="0">Junior</option>
                <option value="1">Mid</option>
                <option value="2">Senior</option>
                <option value="3">Lead</option>
                <option value="4">Principal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Availability
              </label>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Any</option>
                <option value="0">Actively Looking</option>
                <option value="2">Open to Opportunities</option>
              </select>
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </Card>

        {/* Candidate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <Card
              key={candidate.candidateId}
              className="hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {candidate.firstName && candidate.lastName
                      ? `${candidate.firstName} ${candidate.lastName.charAt(
                          0
                        )}.`
                      : "Anonymous Candidate"}
                  </h3>
                  {candidate.desiredRole && (
                    <p className="text-sm text-gray-600">
                      {candidate.desiredRole}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    toggleSave(candidate.candidateId, candidate.isSaved);
                  }}
                  className={`p-2 rounded-full ${
                    candidate.isSaved
                      ? "text-blue-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill={candidate.isSaved ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {getAvailabilityBadge(candidate.availability)}
                {candidate.seniorityEstimate != null && (
                  <Badge variant="default">
                    {getSeniorityLabel(candidate.seniorityEstimate)}
                  </Badge>
                )}
              </div>

              {candidate.topSkills.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {candidate.topSkills.slice(0, 5).map((skill, i) => (
                    <Badge key={i} variant="primary">
                      {skill}
                    </Badge>
                  ))}
                  {candidate.topSkills.length > 5 && (
                    <Badge variant="default">
                      +{candidate.topSkills.length - 5}
                    </Badge>
                  )}
                </div>
              )}

              {candidate.locationPreference && (
                <p className="text-sm text-gray-500 mb-3">
                  {candidate.locationPreference}
                </p>
              )}

              <Link href={`/company/talent/${candidate.candidateId}`}>
                <Button variant="outline" className="w-full">
                  View Profile
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        {candidates.length === 0 && (
          <Card>
            <p className="text-gray-500 text-center py-8">
              No candidates found matching your criteria
            </p>
          </Card>
        )}

        {/* Pagination */}
        {totalCount > 20 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              disabled={page * 20 >= totalCount}
            >
              Next
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
