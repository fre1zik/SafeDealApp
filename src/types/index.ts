export interface User {
  id: number;
  username: string;
  balance: number;
  dealsCompleted: number;
  rating: number;
  ratingCount: number;
  referrerId?: number;
  isFirstDeal: boolean;
}

export interface Deal {
  id: number;
  buyerId: number;
  sellerId: number;
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'disputed' | 'pending_seller';
  buyerRating?: number;
  sellerRating?: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DealFormData {
  amount: number;
  description: string;
  sellerUsername: string;
}

export interface RatingData {
  dealId: number;
  rating: number;
  role: 'buyer' | 'seller';
} 