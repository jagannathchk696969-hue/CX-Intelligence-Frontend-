export const APP_NAME = 'CX Intelligence';

export const USER_ROLES = {
  ADMIN: 'admin',
  SUPPORT_AGENT: 'support_agent',
  CUSTOMER: 'customer',
};

export const TICKET_STATUSES = {
  OPEN: { label: 'Open', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  WAITING_FOR_CUSTOMER: { label: 'Waiting on Customer', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  RESOLVED: { label: 'Resolved', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  CLOSED: { label: 'Closed', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
};

export const TICKET_PRIORITIES = {
  LOW: { label: 'Low', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  MEDIUM: { label: 'Medium', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  HIGH: { label: 'High', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  URGENT: { label: 'Urgent', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
};

export const SENTIMENT_CONFIG = {
  positive: { label: 'Positive', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: 'Smile' },
  neutral: { label: 'Neutral', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20', icon: 'Meh' },
  negative: { label: 'Negative', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', icon: 'Frown' },
};

export const SUGGESTED_QUESTIONS = [
  "What is your refund policy for annual subscriptions?",
  "How do API rate limits and webhooks work?",
  "What security compliance standards do you maintain?",
  "How fast are live support tickets responded to?",
  "Can I speak directly with a human support agent?"
];
