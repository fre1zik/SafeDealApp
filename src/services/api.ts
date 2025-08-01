import { User, Deal, ApiResponse, DealFormData, RatingData } from '../types';

const API_BASE_URL = 'http://localhost:8000'; // URL вашего веб-сервера

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Получить информацию о пользователе
  async getUserInfo(userId: number): Promise<ApiResponse<User>> {
    return this.request<User>(`/api/user/${userId}`);
  }

  // Получить сделки пользователя
  async getUserDeals(userId: number): Promise<ApiResponse<Deal[]>> {
    return this.request<Deal[]>(`/api/user/${userId}/deals`);
  }

  // Создать сделку
  async createDeal(userId: number, dealData: DealFormData): Promise<ApiResponse<Deal>> {
    return this.request<Deal>('/api/deals', {
      method: 'POST',
      body: JSON.stringify({
        buyerId: userId,
        ...dealData,
      }),
    });
  }

  // Подтвердить сделку
  async confirmDeal(dealId: number, userId: number): Promise<ApiResponse<boolean>> {
    return this.request<boolean>(`/api/deals/${dealId}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  // Открыть спор
  async openDispute(dealId: number, userId: number, reason: string): Promise<ApiResponse<boolean>> {
    return this.request<boolean>(`/api/deals/${dealId}/dispute`, {
      method: 'POST',
      body: JSON.stringify({ userId, reason }),
    });
  }

  // Поставить рейтинг
  async submitRating(ratingData: RatingData): Promise<ApiResponse<boolean>> {
    return this.request<boolean>('/api/ratings', {
      method: 'POST',
      body: JSON.stringify(ratingData),
    });
  }

  // Пополнить баланс
  async deposit(userId: number, amount: number): Promise<ApiResponse<string>> {
    return this.request<string>('/api/deposit', {
      method: 'POST',
      body: JSON.stringify({ userId, amount }),
    });
  }

  // Получить реферальную ссылку
  async getReferralLink(userId: number): Promise<ApiResponse<string>> {
    return this.request<string>(`/api/user/${userId}/referral-link`);
  }

  // Получить статистику рефералов
  async getReferralStats(userId: number): Promise<ApiResponse<{ total: number; active: number }>> {
    return this.request<{ total: number; active: number }>(`/api/user/${userId}/referral-stats`);
  }
}

export const apiService = new ApiService(); 