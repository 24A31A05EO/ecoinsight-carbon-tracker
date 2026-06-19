import { Activity, Recommendation, Challenge, UserStats } from '../types';

const STORAGE_KEY = 'ecoinsight_data';

const DEFAULT_ACTIVITIES: Activity[] = [
  {
    id: '3',
    category: 'electricity',
    subCategory: 'ac',
    amount: 12,
    footprint: 8.55,
    date: new Date(Date.now()).toISOString()
  },
  {
    id: '2',
    category: 'food',
    subCategory: 'beef',
    amount: 2,
    footprint: 15.4,
    date: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '1',
    category: 'transport',
    subCategory: 'car',
    amount: 45,
    footprint: 8.64,
    date: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

const DEFAULT_STATS: UserStats = {
  eco_score: 817,
  total_footprint_kg: 32.59,
  activities: DEFAULT_ACTIVITIES,
  level: 3,
  current_xp: 1850,
  next_level_xp: 3000,
  daily_streak: 5,
  badges: []
};

const CARBON_RATES: Record<string, Record<string, number>> = {
  transport: { car: 0.192, bus: 0.105, train: 0.041, flight: 0.255, bike: 0.0 },
  electricity: { ac: 0.7125, fan: 0.0238, tv: 0.0475, laptop: 0.0238 },
  food: { beef: 7.7, chicken: 1.25, fish: 1.3, vegetarian: 0.8, vegan: 0.5 },
  waste: { plastic: 3.0, recyclables: 0.2, organic: 0.1 }
};

function calculateFootprint(category: string, subCategory: string, value: number) {
  const rate = CARBON_RATES[category.toLowerCase()]?.[subCategory.toLowerCase()] || 0;
  return rate * value;
}

class ApiService {
  private getStatsFromStorage(): UserStats {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error reading from localStorage', e);
    }
    
    // Initialize if not present
    this.saveStatsToStorage(DEFAULT_STATS);
    return DEFAULT_STATS;
  }

  private saveStatsToStorage(stats: UserStats) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  async getUserStats(): Promise<UserStats> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getStatsFromStorage());
      }, 300);
    });
  }

  async logActivity(category: string, subCategory: string, amount: number): Promise<Activity> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = this.getStatsFromStorage();
        const footprint = calculateFootprint(category, subCategory, amount);
        
        const newActivity: Activity = {
          id: Date.now().toString(),
          category,
          subCategory: subCategory.toLowerCase(),
          amount,
          footprint: Number(footprint.toFixed(2)),
          date: new Date().toISOString()
        };

        stats.activities.unshift(newActivity);
        stats.total_footprint_kg = Number((stats.total_footprint_kg + newActivity.footprint).toFixed(2));
        stats.eco_score = Math.max(0, stats.eco_score - Math.round(newActivity.footprint));

        this.saveStatsToStorage(stats);
        resolve(newActivity);
      }, 500);
    });
  }

  async getRecommendations(): Promise<Recommendation[]> {
    return Promise.resolve([
      { title: "Thermal Optimization", description: "Reduce AC usage by 2 hours daily.", co2_savings_kg: 9.98, money_savings_usd: 2.73, difficulty: "Low" }
    ]);
  }

  async getChallenges(): Promise<Challenge[]> {
    return Promise.resolve([
      { id: "c1", title: "Zero-Emission Commute", description: "Log 50km of bicycle transit.", target_kg: 50, progress_kg: 12, completed: false, reward_points: 200 }
    ]);
  }
}

export const api = new ApiService();
