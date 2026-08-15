export interface Scheme {
  id?: string;
  title: string;
  description: string;
  category: string;
  state: string;
  minAge?: number | null;
  maxAge?: number | null;
  maxIncome?: number | null;
  targetGender?: 'Male' | 'Female' | 'Any' | null;
  targetOccupation?: string | null;
  benefits: string[];
  applyLink?: string | null;
  lastSyncedAt: string;
}

export const CATEGORY_MAP: Record<string, string> = {
  'CS': 'Central Sector Scheme',
  'CSS': 'Centrally Sponsored Scheme',
  'CCP': 'Climate Change Programme',
  '—': 'General',
};

export function formatCategoryName(category?: string | null): string {
  if (!category || category === '—') return 'General';
  return CATEGORY_MAP[category.trim()] || category;
}

