export type GuestStage = 'invited' | 'booked' | 'recorded' | 'published';

export interface Guest {
  id: string;
  name: string;
  email: string;
  bio: string;
  topic_keywords: string[];
  stage: GuestStage;
  avatar_url?: string;
}

export interface Booking {
  id: string;
  guest_id: string;
  starts_at: string;
  ends_at: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

// Mock initial data
export const MOCK_GUESTS: Guest[] = [
  {
    id: '1',
    name: 'Sarah Drasner',
    email: 'sarah@example.com',
    bio: 'VP of Engineering at some cool startup.',
    topic_keywords: ['vue', 'engineering leadership'],
    stage: 'invited',
    avatar_url: 'https://i.pravatar.cc/150?u=sarah'
  },
  {
    id: '2',
    name: 'Guillermo Rauch',
    email: 'rauchg@vercel.com',
    bio: 'CEO of Vercel.',
    topic_keywords: ['nextjs', 'edge computing'],
    stage: 'booked',
    avatar_url: 'https://i.pravatar.cc/150?u=guillermo'
  },
  {
    id: '3',
    name: 'Lee Robinson',
    email: 'lee@vercel.com',
    bio: 'VP of Developer Experience.',
    topic_keywords: ['react', 'nextjs', 'developer experience'],
    stage: 'recorded',
    avatar_url: 'https://i.pravatar.cc/150?u=lee'
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    guest_id: '2',
    starts_at: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    ends_at: new Date(Date.now() + 86400000 * 2 + 3600000).toISOString(),
    status: 'confirmed'
  }
];
