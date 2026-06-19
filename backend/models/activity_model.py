from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database.session import Base

class CarbonActivity(Base):
    __tablename__ = "carbon_activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category = Column(String, nullable=False)
    sub_category = Column(String, nullable=False)
    input_value = Column(Float, nullable=False, default=0.0)
    description = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    calculation = relationship("CarbonCalculation", back_populates="activity", uselist=False)

class CarbonCalculation(Base):
    __tablename__ = "carbon_calculations"

    id = Column(Integer, primary_key=True, index=True)
    activity_id = Column(Integer, ForeignKey("carbon_activities.id", ondelete="CASCADE"), unique=True, nullable=False)
    footprint_value = Column(Float, nullable=False)
    calculation_date = Column(DateTime(timezone=True), server_default=func.now())

    activity = relationship("CarbonActivity", back_populates="calculation")
    
class EcoScore(Base):
    __tablename__ = "eco_scores"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    current_score = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
