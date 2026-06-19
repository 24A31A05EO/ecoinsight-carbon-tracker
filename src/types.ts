export interface Activity {
  id: string;
  category: string;
  subCategory: string;
  amount: number;
  footprint: number; // kg CO2e
  date: string;
}

export interface Recommendation {
  title: string;
  description: string;
  co2_savings_kg: number;
  money_savings_usd: number;
  difficulty: 'Low' | 'Medium' | 'High';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target_kg: number;
  progress_kg: number;
  completed: boolean;
  reward_points: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

export interface UserStats {
  eco_score: number;
  total_footprint_kg: number;
  activities: Activity[];
  level: number;
  current_xp: number;
  next_level_xp: number;
  daily_streak: number;
  badges: Badge[];
}
