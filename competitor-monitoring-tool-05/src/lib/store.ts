import { format, subDays } from 'date-fns';

export type ChangeCategory = 'pricing' | 'hiring' | 'product' | 'other';

export interface ChangeEvent {
  id: string;
  competitorId: string;
  date: string;
  category: ChangeCategory;
  summary: string;
  diff: {
    added?: string;
    removed?: string;
  };
  url: string;
}

export interface Competitor {
  id: string;
  name: string;
  domain: string;
  lastChecked: string;
  status: 'active' | 'error';
}

const today = new Date();

export const MOCK_COMPETITORS: Competitor[] = [
  { id: '1', name: 'Acme Corp', domain: 'acme.com', lastChecked: today.toISOString(), status: 'active' },
  { id: '2', name: 'Globex', domain: 'globex.io', lastChecked: today.toISOString(), status: 'active' },
  { id: '3', name: 'Soylent', domain: 'soylent.dev', lastChecked: today.toISOString(), status: 'error' },
];

export const MOCK_CHANGES: ChangeEvent[] = [
  {
    id: 'c1',
    competitorId: '1',
    date: today.toISOString(),
    category: 'pricing',
    summary: 'Acme Corp increased their Pro tier pricing by $10/mo.',
    diff: {
      removed: '$29/month per user',
      added: '$39/month per user'
    },
    url: 'https://acme.com/pricing'
  },
  {
    id: 'c2',
    competitorId: '1',
    date: subDays(today, 2).toISOString(),
    category: 'hiring',
    summary: 'Acme Corp listed 3 new engineering roles, suggesting an upcoming product push.',
    diff: {
      added: 'Senior Frontend Engineer (React/Next.js)\nBackend Engineer (Python/FastAPI)\nProduct Designer'
    },
    url: 'https://acme.com/careers'
  },
  {
    id: 'c3',
    competitorId: '2',
    date: subDays(today, 5).toISOString(),
    category: 'product',
    summary: 'Globex updated their hero copy to focus on Enterprise features instead of startups.',
    diff: {
      removed: 'The best analytics tool for early-stage founders.',
      added: 'Enterprise-grade analytics for data-driven organizations.'
    },
    url: 'https://globex.io/'
  }
];

// Helper functions for the UI
export const getChangesForCompetitor = (competitorId: string) => {
  return MOCK_CHANGES.filter(c => c.competitorId === competitorId);
};

export const getCompetitorName = (id: string) => {
  return MOCK_COMPETITORS.find(c => c.id === id)?.name || 'Unknown';
};
