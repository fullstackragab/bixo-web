// Location types
export interface Location {
  country?: string;
  city?: string;
  timezone?: string;
  willingToRelocate?: boolean;
  displayText?: string;
}

export interface HiringLocation {
  isRemote: boolean;
  country?: string;
  city?: string;
  timezone?: string;
  displayText?: string;
}

export interface LocationRanking {
  preferRemote?: boolean;
  preferCountry?: string;
  preferTimezone?: string;
  preferRelocationFriendly?: boolean;
}

// Enums
export enum UserType {
  Candidate = 0,
  Company = 1,
  Admin = 2
}

export enum RemotePreference {
  Remote = 0,
  Onsite = 1,
  Hybrid = 2,
  Flexible = 3
}

export enum Availability {
  Open = 0,
  NotNow = 1,
  Passive = 2
}

export enum SeniorityLevel {
  Junior = 0,
  Mid = 1,
  Senior = 2,
  Lead = 3,
  Principal = 4
}

export enum SkillCategory {
  Language = 0,
  Framework = 1,
  Tool = 2,
  Database = 3,
  Cloud = 4,
  Other = 5
}

export enum SubscriptionTier {
  Free = 0,
  Starter = 1,
  Pro = 2
}

export enum ShortlistStatus {
  Pending = 0,
  Processing = 1,
  Completed = 2,
  Cancelled = 3
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Auth types
export interface AuthResponse {
  userId: string;
  email: string;
  userType: UserType;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  candidateId?: string;
  companyId?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  userType: UserType;
  isActive: boolean;
  createdAt: string;
  lastActiveAt: string;
  candidateId?: string;
  companyId?: string;
}

// Candidate types
export interface CandidateSkill {
  id: string;
  skillName: string;
  confidenceScore: number;
  category: SkillCategory;
  isVerified: boolean;
}

export interface CandidateProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  linkedInUrl?: string;
  cvFileName?: string;
  cvDownloadUrl?: string;
  desiredRole?: string;
  locationPreference?: string;
  location?: Location;
  remotePreference?: RemotePreference;
  locationDisplayText?: string;
  availability: Availability;
  openToOpportunities: boolean;
  profileVisible: boolean;
  seniorityEstimate?: SeniorityLevel;
  skills: CandidateSkill[];
  recommendationsCount: number;
  profileViewsCount: number;
  createdAt: string;
  lastActiveAt: string;
}

// Company types
export interface CompanyProfile {
  id: string;
  companyName?: string;
  industry?: string;
  companySize?: string;
  website?: string;
  logoUrl?: string;
  location?: Location;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt?: string;
  messagesRemaining: number;
  createdAt: string;
}

export interface TalentCandidate {
  candidateId: string;
  firstName?: string;
  lastName?: string;
  desiredRole?: string;
  locationPreference?: string;
  location?: Location;
  remotePreference?: RemotePreference;
  locationDisplayText?: string;
  availability: Availability;
  seniorityEstimate?: SeniorityLevel;
  topSkills: string[];
  recommendationsCount: number;
  lastActiveAt: string;
  matchScore: number;
  isSaved: boolean;
}

export interface TalentSearchResult {
  candidates: TalentCandidate[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Message types
export interface Message {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  otherUserId: string;
  otherUserName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

// Shortlist types
export interface ShortlistRequest {
  id: string;
  roleTitle: string;
  techStackRequired: string[];
  seniorityRequired?: SeniorityLevel;
  locationPreference?: string;
  hiringLocation?: HiringLocation;
  remoteAllowed: boolean;
  additionalNotes?: string;
  status: ShortlistStatus;
  pricePaid?: number;
  createdAt: string;
  completedAt?: string;
  candidatesCount: number;
}

// Notification types
export interface Notification {
  id: string;
  type: string;
  title: string;
  message?: string;
  data?: string;
  isRead: boolean;
  createdAt: string;
}
