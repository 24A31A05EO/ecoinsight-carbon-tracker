from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.session import get_db
from models.user_model import User
from schemas.user_schema import UserCreate, UserResponse, Token
from core.security import get_password_hash, create_access_token
from typing import Any

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    """
    Registers a new node in the identity matrix.
    """
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Identity link already exists (email taken)")
    
    hashed_password = get_password_hash(user_in.password)
    db_user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
def login_user(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Acquires authentication token for datacore access.
    Note: Simplification for demonstration. Usually uses OAuth2PasswordRequestForm.
    """
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid coordinates (wrong email)")
    
    from core.security import verify_password
    if not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Decryption failed (wrong password)")
        
    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}

from models.activity_model import CarbonActivity, CarbonCalculation, EcoScore

@router.get("/{user_id}/stats")
def get_user_stats(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    activities = db.query(CarbonActivity).filter(CarbonActivity.user_id == user_id).order_by(CarbonActivity.created_at.desc()).all()
    
    total_footprint = 0.0
    act_list = []
    for a in activities:
        fp = a.calculation.footprint_value if a.calculation else 0.0
        total_footprint += fp
        act_list.append({
            "id": str(a.id),
            "category": a.category,
            "subCategory": a.sub_category,
            "amount": a.input_value,
            "footprint": fp,
            "date": a.created_at.isoformat()
        })
        
    eco_score_record = db.query(EcoScore).filter(EcoScore.user_id == user_id).first()
    eco_score = eco_score_record.current_score if eco_score_record else 850
    
    return {
        "eco_score": eco_score,
        "total_footprint_kg": round(total_footprint, 2),
        "activities": act_list,
        "level": user.sustainability_level,
        "current_xp": user.eco_points,
        "next_level_xp": max(100, user.sustainability_level * 1000),
        "daily_streak": user.daily_streak,
        "badges": []
    }

@router.get("/{user_id}/recommendations")
def get_recommendations(user_id: int, db: Session = Depends(get_db)):
    activities = db.query(CarbonActivity).filter(CarbonActivity.user_id == user_id).all()
    
    transport_car = sum([a.input_value for a in activities if a.category == "transport" and a.sub_category == "car"])
    food_beef = [a for a in activities if a.category == "food" and a.sub_category == "beef"]
    
    recs = []
    if transport_car > 20:
        recs.append({
            "title": "Public Transit Swap",
            "description": "Switch 50% of your car commute to the public transit network.",
            "co2_savings_kg": round(transport_car * 0.5 * (0.192 - 0.105), 2),
            "money_savings_usd": round(transport_car * 0.5 * 0.15, 2),
            "difficulty": "Medium"
        })
    if len(food_beef) >= 2:
        recs.append({
            "title": "Carnivorous Downscale",
            "description": "Replace 2 heavy resource meals (beef) per week with poultry or plant-based alternatives.",
            "co2_savings_kg": round(2 * (7.7 - 1.25), 2),
            "money_savings_usd": 15.00,
            "difficulty": "Medium"
        })
        
    recs.append({
        "title": "Thermal Optimization",
        "description": "Reduce AC usage by 2 hours daily. Utilize ceiling fans or passive cooling.",
        "co2_savings_kg": 9.98,
        "money_savings_usd": 2.73,
        "difficulty": "Low"
    })
    
    return recs[:3]

@router.get("/{user_id}/challenges")
def get_challenges(user_id: int, db: Session = Depends(get_db)):
    return [
        { "id": "c1", "title": "Zero-Emission Commute", "description": "Log 50km of bicycle transit.", "target_kg": 50, "progress_kg": 12, "completed": False, "reward_points": 200 },
        { "id": "c2", "title": "Plant-Based Week", "description": "Log 15 vegan or vegetarian meals.", "target_kg": 15, "progress_kg": 15, "completed": True, "reward_points": 500 },
        { "id": "c3", "title": "Grid Detachment", "description": "Keep electricity footprint under 5kg for 3 days.", "target_kg": 5, "progress_kg": 2.1, "completed": False, "reward_points": 300 }
    ]
