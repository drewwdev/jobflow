export type AppStatus = 0 | 1 | 2 | 3 | 4 | 5;

export type Application = {
  id: string;
  title: string;
  sourceUrl?: string | null;
  location?: string | null;
  status: AppStatus;
  companyId?: string | null;
  companyName?: string | null;
  createdAt: string;
  updatedAt: string;
  appliedAt?: string | null;
  interviewAt?: string | null;
  offerAt?: string | null;
};

export const STATUS_LABEL: Record<AppStatus, string> = {
  0: "Saved",
  1: "Applied",
  2: "PhoneScreen",
  3: "Interview",
  4: "Offer",
  5: "Rejected",
};

export type Company = {
  id: string;
  name: string;
  website?: string | null;
  createdAt: string;
};

export type CreatePayload = {
  type: string;
  body: string;
  occurredAt?: string | null;
};

export const TYPES = ["Note", "Call", "Interview", "Email", "Other"] as const;

export type Activity = {
  id: string;
  applicationId: string;
  userId?: string;
  type: string;
  body: string;
  occurredAt: string;
  createdAt: string;
};

export type ActivityFilters = {
  type?: string;
  from?: string;
  to?: string;
};

export type ApplicationUpdate = {
  title: string;
  location?: string | null;
  sourceUrl?: string | null;
  status: AppStatus;
  companyId?: string | null;
  appliedAt?: string | null;
  interviewAt?: string | null;
  offerAt?: string | null;
};
