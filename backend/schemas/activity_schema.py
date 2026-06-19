from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ActivityBase(BaseModel):
    category: str = Field(..., description="transport, electricity, food, waste")
    sub_category: str = Field(..., description="Specific sub category like car, laptop, beef")
    description: Optional[str] = None

class ActivityCreate(ActivityBase):
    input_value: float = Field(..., description="Input metric (e.g., miles, kWh, logs)")

class ActivityResponse(ActivityBase):
    id: int
    user_id: int
    input_value: float
    created_at: datetime
    footprint_value: float = Field(..., description="Calculated carbon footprint in kg CO2")

    class Config:
        from_attributes = True
