export interface Birthday {
  id: string;
  name: string;
  date: string; // ISO Date string YYYY-MM-DD
  relationship: string;
}

export interface WishGeneratorParams {
  name: string;
  age: number;
  relationship: string;
  tone?: 'funny' | 'sincere' | 'cyberpunk';
}

export interface GeneratedWishResponse {
  wish: string;
  giftIdeas: string[];
}
