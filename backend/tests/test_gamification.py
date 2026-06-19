import pytest
from datetime import datetime, timedelta
from services.gamification import GamificationEngine

def test_calculate_level():
    # Level 1
    assert GamificationEngine.calculate_level(0) == 1
    assert GamificationEngine.calculate_level(499) == 1
    # Level 2
    assert GamificationEngine.calculate_level(500) == 2
    assert GamificationEngine.calculate_level(1499) == 2
    # Level 10
    assert GamificationEngine.calculate_level(50000) == 10
    assert GamificationEngine.calculate_level(999999) == 10

def test_process_activity_no_prior_data():
    user_dict = {}
    activity_date = datetime.now()
    
    # 0 footprint -> 50 points
    result = GamificationEngine.process_activity(user_dict, 0.0, "transport", activity_date)
    
    # Base 50 points + Streak(1)*5 = 55 points
    assert result["points_earned_this_event"] == 55
    assert result["eco_points"] == 55
    assert result["daily_streak"] == 1
    assert result["sustainability_level"] == 1
    assert "FIRST_LOG" in result["badges"]
    assert result["last_activity_date"] == activity_date

def test_process_activity_maintains_streak():
    last_date = datetime.now() - timedelta(days=1)
    user_dict = {
        "eco_points": 100,
        "daily_streak": 3,
        "last_activity_date": last_date,
        "badges": ["FIRST_LOG"]
    }
    activity_date = datetime.now()
    
    # Footprint 10 -> Base points: max(10, 50 - 20) = 30 points
    result = GamificationEngine.process_activity(user_dict, 10.0, "food", activity_date)
    
    # Earned points: 30 + Streak(4)*5 = 50
    assert result["points_earned_this_event"] == 50
    assert result["eco_points"] == 150
    assert result["daily_streak"] == 4

def test_process_activity_breaks_streak():
    last_date = datetime.now() - timedelta(days=5)
    user_dict = {
        "eco_points": 100,
        "daily_streak": 10,
        "last_activity_date": last_date,
        "badges": ["FIRST_LOG", "STREAK_7"]
    }
    activity_date = datetime.now()
    
    result = GamificationEngine.process_activity(user_dict, 0.0, "food", activity_date)
    
    assert result["daily_streak"] == 1 # Streak reset to 1
    # Points: 50 (base) + 1*5 (streak) = 55
    assert result["eco_points"] == 155

def test_transit_master_badge():
    user_dict = {
        "eco_points": 0,
        "daily_streak": 1,
        "last_activity_date": datetime.now(),
        "badges": ["FIRST_LOG"]
    }
    
    result = GamificationEngine.process_activity(user_dict, 0.2, "transport", datetime.now())
    assert "TRANSIT_MASTER" in result["badges"]
