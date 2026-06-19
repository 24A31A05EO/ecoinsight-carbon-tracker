from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from database.session import engine, SessionLocal
from models.user_model import User, Base as UserBase
from models.activity_model import Base as ActivityBase
from routers import users, activities

# Create tables matching our schema directly (dev prototype initialization)
UserBase.metadata.create_all(bind=engine)
ActivityBase.metadata.create_all(bind=engine)

# Create a default user
db = SessionLocal()
default_user = db.query(User).filter(User.id == 1).first()
if not default_user:
    default_user = User(
        id=1,
        username="eco_warrior",
        email="test@example.com",
        hashed_password="not_a_real_password",
        sustainability_level=3,
        eco_points=1850,
        daily_streak=5
    )
    db.add(default_user)
    db.commit()

from models.activity_model import CarbonActivity, CarbonCalculation, EcoScore
import datetime

eco_score = db.query(EcoScore).filter(EcoScore.user_id == 1).first()
if not eco_score:
    eco_score = EcoScore(user_id=1, current_score=850)
    db.add(eco_score)
    db.commit()

acts = db.query(CarbonActivity).filter(CarbonActivity.user_id == 1).count()
if acts == 0:
    act1 = CarbonActivity(user_id=1, category="transport", sub_category="car", input_value=45, created_at=datetime.datetime.now() - datetime.timedelta(days=2))
    act2 = CarbonActivity(user_id=1, category="food", sub_category="beef", input_value=2, created_at=datetime.datetime.now() - datetime.timedelta(days=1))
    act3 = CarbonActivity(user_id=1, category="electricity", sub_category="ac", input_value=12, created_at=datetime.datetime.now())
    db.add_all([act1, act2, act3])
    db.commit()
    
    # Needs related calculations
    calc1 = CarbonCalculation(activity_id=act1.id, footprint_value=8.64)
    calc2 = CarbonCalculation(activity_id=act2.id, footprint_value=15.4)
    calc3 = CarbonCalculation(activity_id=act3.id, footprint_value=8.55)
    db.add_all([calc1, calc2, calc3])
    db.commit()
db.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend Datacore for Carbon Tracking Matrix",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["Users"])
app.include_router(activities.router, prefix=f"{settings.API_V1_STR}/activities", tags=["Activities"])

@app.get("/health")
def health_check():
    return {"status": "ONLINE", "module": "Datacore", "version": "1.0.0"}
