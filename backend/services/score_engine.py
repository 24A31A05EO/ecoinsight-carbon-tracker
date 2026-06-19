from sqlalchemy.orm import Session
from models.activity_model import EcoScore

def update_eco_score(db: Session, user_id: int, footprint_added: float):
    """
    Updates the player's core environmental tracking logic.
    Less structural entropy (footprint) = Higher resilience score.
    """
    score_record = db.query(EcoScore).filter(EcoScore.user_id == user_id).first()
    
    if not score_record:
        # Initial boot score
        score_record = EcoScore(user_id=user_id, current_score=1000)
        db.add(score_record)
        db.commit()
    
    # Simple algorithmic penalty: 1 kg CO2 subtracts 1 sustainability point
    penalty = int(footprint_added)
    score_record.current_score -= penalty
    
    db.commit()
    db.refresh(score_record)
    return score_record
