import { Activity, Recommendation, Challenge, UserStats } from '../types';

const BASE_URL = '/api/v1';
const USER_ID = 1;

class ApiService {
  private getHeaders() {
    return {
      'Content-Type': 'application/json'
    };
  }

  async getUserStats(): Promise<UserStats> {
    const res = await fetch(`${BASE_URL}/users/${USER_ID}/stats`, { 
      headers: this.getHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  }

  async logActivity(category: string, subCategory: string, amount: number): Promise<Activity> {
    const res = await fetch(`${BASE_URL}/activities?user_id=${USER_ID}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ category, sub_category: subCategory.toLowerCase(), input_value: amount, description: '' })
    });
    if (!res.ok) throw new Error('Failed to log activity');
    const data = await res.json();
    return {
      id: data.id.toString(),
      category: data.category,
      subCategory: data.sub_category,
      amount: data.input_value,
      footprint: data.footprint_value,
      date: data.created_at
    };
  }

  async getRecommendations(): Promise<Recommendation[]> {
    const res = await fetch(`${BASE_URL}/users/${USER_ID}/recommendations`, { 
      headers: this.getHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
  }

  async getChallenges(): Promise<Challenge[]> {
    const res = await fetch(`${BASE_URL}/users/${USER_ID}/challenges`, { 
      headers: this.getHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch challenges');
    return res.json();
  }
}

export const api = new ApiService();
