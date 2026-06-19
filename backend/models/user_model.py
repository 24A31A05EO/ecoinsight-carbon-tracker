from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.sql import func
from database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Gamification fields
    eco_points = Column(Integer, default=0)
    sustainability_level = Column(Integer, default=1)
    daily_streak = Column(Integer, default=0)
    last_activity_date = Column(DateTime(timezone=True), nullable=True)
    badges = Column(JSON, default=list) # List of badge string IDs

