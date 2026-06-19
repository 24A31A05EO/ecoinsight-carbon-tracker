from typing import List, Dict, Any

class RecommendationEngine:
    """
    Intelligent rule-based synthetic AI for generating personalized
    sustainability directives and calculating estimated resource savings.
    """

    @staticmethod
    def calculate_scores(user_activities: List[Dict[str, Any]]) -> Dict[str, float]:
        """
        Calculates the carbon footprint score (kg CO2e) and a synthetic Eco Score (0-1000).
        Higher Eco Score means better planet alignment.
        """
        from .carbon_calc import CarbonEngine # internal import to avoid circular dep
        
        total_carbon = 0.0
        for activity in user_activities:
            cat = activity.get("category", "")
            sub = activity.get("sub_category", "")
            amt = activity.get("amount", 0.0)
            try:
                total_carbon += CarbonEngine.compute(cat, sub, amt)
            except ValueError:
                pass
                
        # Base score 1000. Deduct 10 points for every 1 kg of CO2e. Minimum 0.
        eco_score = max(0, 1000 - (total_carbon * 10))
        
        return {
            "carbon_footprint_kg_co2": round(total_carbon, 2),
            "eco_score": int(eco_score)
        }
    
    @staticmethod
    def generate_recommendations(user_activities: List[Dict[str, Any]], current_eco_score: int) -> List[Dict[str, Any]]:
        recommendations = []
        
        # Analyze transport profile
        transport_activities = [a for a in user_activities if a.get("category") == "transport"]
        car_km = sum(a.get("amount", 0) for a in transport_activities if a.get("sub_category") == "car")
        
        if car_km > 50:
            recommendations.append({
                "title": "Public Transit Swap",
                "description": "Switch 50% of your car commute to the public transit network.",
                "co2_savings_kg": round(car_km * 0.5 * (0.192 - 0.105), 2),
                "money_savings_usd": round(car_km * 0.5 * 0.15, 2), # Estimated $0.15/km fuel savings
                "difficulty": "Medium"
            })
            
        if car_km > 0 and car_km <= 50:
             recommendations.append({
                "title": "Bicycle Protocol",
                "description": "Short distance anomaly detected. Replace car trips under 5km with cycling.",
                "co2_savings_kg": round(car_km * 0.192, 2),
                "money_savings_usd": round(car_km * 0.20, 2), # Factoring in wear/tear for short trips
                "difficulty": "Low"
            })           

        # Analyze food profile
        food_activities = [a for a in user_activities if a.get("category") == "food"]
        beef_meals = sum(a.get("amount", 0) for a in food_activities if a.get("sub_category") == "beef")
        
        if beef_meals > 3:
            recommendations.append({
                "title": "Carnivorous Downscale",
                "description": "Replace 2 heavy resource meals (beef) per week with poultry or plant-based alternatives.",
                "co2_savings_kg": round(2 * (7.7 - 1.25), 2),
                "money_savings_usd": 15.00, # Estimated cost diff
                "difficulty": "Medium"
            })

        # Analyze energy profile
        energy_activities = [a for a in user_activities if a.get("category") == "electricity"]
        ac_hours = sum(a.get("amount", 0) for a in energy_activities if a.get("sub_category") == "ac")
        
        if ac_hours > 20: 
            recommendations.append({
                "title": "Thermal Optimization",
                "description": "Reduce AC usage by 2 hours daily. Utilize ceiling fans or passive cooling.",
                "co2_savings_kg": round(14 * 0.7125, 2), # 2 hours * 7 days
                "money_savings_usd": round(14 * 1.5 * 0.13, 2), # 1500W * 14h = 21kWh * $0.13/kWh avg
                "difficulty": "Low"
            })

        # High Eco Score edge case (positive reinforcement AI)
        if current_eco_score > 2000 and not recommendations:
            recommendations.append({
                "title": "Grid Export Mode",
                "description": "Efficiency maximized. Consider installing home solar or buying green energy credits.",
                "co2_savings_kg": 0.0,
                "money_savings_usd": 0.0,
                "difficulty": "High"
            })

        # Sort by highest impact (co2 reduction)
        recommendations.sort(key=lambda x: x["co2_savings_kg"], reverse=True)
        return recommendations[:3] # Enforce limit to top 3 directives
