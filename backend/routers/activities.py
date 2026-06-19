from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any
from database.session import get_db
from models.activity_model import CarbonActivity, CarbonCalculation
from schemas.activity_schema import ActivityCreate, ActivityResponse
from services.carbon_calc import calculate_footprint
from services.score_engine import update_eco_score

router = APIRouter()

@router.post("", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
def log_carbon_activity(
    activity: ActivityCreate, 
    user_id: int, # Typically extracted from JWT Token dependency
    db: Session = Depends(get_db)
) -> Any:
    """
    Injects a real-world activity into the matrix and calculates entropy (carbon).
    """
    valid_cats = ["transport", "electricity", "food", "waste"]
    if activity.category not in valid_cats:
        raise HTTPException(status_code=400, detail="Invalid category parameters")
    
    # 1. Register Action Node
    db_activity = CarbonActivity(
        user_id=user_id,
        category=activity.category,
        sub_category=activity.sub_category,
        input_value=activity.input_value,
        description=activity.description
    )
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)

    # 2. Translate Action to Metrics (Compute Layer)
    footprint = calculate_footprint(activity.category, activity.input_value, activity.sub_category)

    # 3. Store Computed Constants
    db_calc = CarbonCalculation(
        activity_id=db_activity.id,
        footprint_value=footprint
    )
    db.add(db_calc)
    
    # 4. Impact Aggregate Score
    update_eco_score(db, user_id, footprint)

    db.commit()

    return ActivityResponse(
        id=db_activity.id,
        user_id=db_activity.user_id,
        category=db_activity.category,
        sub_category=db_activity.sub_category,
        input_value=activity.input_value,
        description=db_activity.description,
        created_at=db_activity.created_at,
        footprint_value=footprint
    )
