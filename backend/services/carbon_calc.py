from typing import Dict, Callable

# ---------------------------------------------------------
# PRE-COMPUTED EMISSION CONSTANTS (O(1) Dictionary Lookups)
# Values represent kg CO2e per unit. 
# ---------------------------------------------------------

TRANSPORT_KG_PER_KM: Dict[str, float] = {
    "car": 0.192,     # Average internal combustion engine
    "bus": 0.105,     # Average public transit
    "train": 0.041,   # Intercity/National public rail
    "flight": 0.255,  # Short-haul economic class
    "bike": 0.0       # Zero-emission baseline
}

# Average grid intensity (~0.475 kg CO2e per kWh)
GRID_INTENSITY = 0.475 

# We pre-calculate hourly emissions at module load, rather than at runtime.
# Formula: (Watts / 1000) * GRID_INTENSITY = kg CO2e per Hour
ELECTRICITY_KG_PER_HOUR: Dict[str, float] = {
    "ac": (1500.0 / 1000.0) * GRID_INTENSITY,       # ~0.7125 kg/hr
    "fan": (50.0 / 1000.0) * GRID_INTENSITY,        # ~0.02375 kg/hr
    "tv": (100.0 / 1000.0) * GRID_INTENSITY,        # ~0.0475 kg/hr
    "laptop": (50.0 / 1000.0) * GRID_INTENSITY      # ~0.02375 kg/hr
}

FOOD_KG_PER_MEAL: Dict[str, float] = {
    "beef": 7.7,        # Heavy resource consumption (methane + land)
    "chicken": 1.25,
    "fish": 1.3,
    "vegetarian": 0.8,
    "vegan": 0.5        # Lowest impact baseline
}

WASTE_KG_PER_KG: Dict[str, float] = {
    "plastic": 3.0,     # High processing/incineration footprint
    "recyclables": 0.2, # Net positive but requires processing energy
    "organic": 0.1      # Assuming composted (higher if landfilled)
}

class CarbonEngine:
    """
    Singleton calculation engine utilizing Strategy Pattern.
    Sub-microsecond resolution via O(1) hash map routing.
    """
    @staticmethod
    def _calc_transport(sub_category: str, value: float) -> float:
        return TRANSPORT_KG_PER_KM.get(sub_category.lower(), 0.0) * value

    @staticmethod
    def _calc_electricity(sub_category: str, value: float) -> float:
        return ELECTRICITY_KG_PER_HOUR.get(sub_category.lower(), 0.0) * value

    @staticmethod
    def _calc_food(sub_category: str, value: float) -> float:
        return FOOD_KG_PER_MEAL.get(sub_category.lower(), 0.0) * value

    @staticmethod
    def _calc_waste(sub_category: str, value: float) -> float:
        return WASTE_KG_PER_KG.get(sub_category.lower(), 0.0) * value

    @classmethod
    def compute(cls, category: str, sub_category: str, amount: float) -> float:
        """
        O(1) Route dispatch. Eliminates branching logic (if/else chains) 
        for highly consistent execution time.
        """
        router: Dict[str, Callable[[str, float], float]] = {
            "transport": cls._calc_transport,
            "electricity": cls._calc_electricity,
            "food": cls._calc_food,
            "waste": cls._calc_waste
        }
        
        calc_func = router.get(category.lower())
        if not calc_func:
            raise ValueError(f"CRITICAL: Unknown telemetry category '{category}'")
            
        # Float arithmetic normalization
        return round(calc_func(sub_category, amount), 4)

def calculate_footprint(category: str, input_value: float, sub_category: str = "") -> float:
    """
    Legacy adapter for backwards compatibility with initial API spec.
    """
    # Safe fallback if only top-level category is provided
    if not sub_category:
        defaults = {
            "Transport": "car", 
            "Energy": "ac", 
            "Diet": "beef", 
            "Goods": "plastic"
        }
        # Remap legacy broad categories to new detailed engine categories
        cat_map = {
            "Transport": "transport",
            "Energy": "electricity",
            "Diet": "food",
            "Goods": "waste"
        }
        mapped_cat = cat_map.get(category, "transport")
        sub_category = defaults.get(category, "car")
        return CarbonEngine.compute(mapped_cat, sub_category, input_value)
        
    return CarbonEngine.compute(category, sub_category, input_value)
