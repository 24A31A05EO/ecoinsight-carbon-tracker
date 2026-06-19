from datetime import datetime, timedelta
from typing import Dict, Any, List

class GamificationEngine:
    """
    Handles logic for Eco points, streaks, leveling, and badges.
    """
    
    LEVEL_THRESHOLDS = {
        1: 0,
        2: 500,
        3: 1500,
        4: 3000,
        5: 5000,
        6: 8000,
        7: 12000,
        8: 20000,
        9: 35000,
        10: 50000
    }
    
    BADGES_CRITERIA = {
        "FIRST_LOG": {"name": "First Step", "description": "Logged your first activity.", "points_bonus": 50},
        "STREAK_7": {"name": "Consistency Starter", "description": "7 day activity streak.", "points_bonus": 200},
        "STREAK_30": {"name": "Eco Warrior", "description": "30 day activity streak.", "points_bonus": 1000},
        "TRANSIT_MASTER": {"name": "Transit Master", "description": "Saved over 50kg CO2 on public transit.", "points_bonus": 300},
        "PLANT_BASED": {"name": "Plant Power", "description": "Logged 10 vegan/vegetarian meals.", "points_bonus": 250}
    }

    @staticmethod
    def calculate_level(eco_points: int) -> int:
        current_lvl = 1
        for lvl, threshold in sorted(GamificationEngine.LEVEL_THRESHOLDS.items()):
            if eco_points >= threshold:
                current_lvl = lvl
            else:
                break
        return current_lvl

    @staticmethod
    def process_activity(user_dict: dict, activity_footprint: float, activity_category: str, activity_date: datetime) -> dict:
        """
        Takes user data dictionary and recent activity, returns updated gamification fields.
        """
        points_earned = max(10, int(50 - activity_footprint * 2)) # Base points + penalty for high footprint
        
        # Streak logic
        last_date = user_dict.get('last_activity_date')
        streak = user_dict.get('daily_streak', 0)
        
        if last_date:
            delta_days = (activity_date.date() - last_date.date()).days
            if delta_days == 1:
                streak += 1
            elif delta_days > 1:
                streak = 1 # Streak broken
        else:
            streak = 1
            
        points_earned += (streak * 5) # Score multiplier for streaks
        
        eco_points = user_dict.get('eco_points', 0) + points_earned
        
        # Level check
        new_level = GamificationEngine.calculate_level(eco_points)
        
        # Badges check (simplified mock check)
        badges = set(user_dict.get('badges', []))
        if len(badges) == 0:
            badges.add("FIRST_LOG")
        if streak >= 7 and "STREAK_7" not in badges:
            badges.add("STREAK_7")
        if streak >= 30 and "STREAK_30" not in badges:
            badges.add("STREAK_30")
        if activity_category == "transport" and activity_footprint < 0.5 and "TRANSIT_MASTER" not in badges:
            badges.add("TRANSIT_MASTER") # roughly mock
            
        return {
            "eco_points": eco_points,
            "sustainability_level": new_level,
            "daily_streak": streak,
            "last_activity_date": activity_date,
            "badges": list(badges),
            "points_earned_this_event": points_earned
        }
