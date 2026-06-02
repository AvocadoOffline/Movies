# utils/seats.py
from sqlalchemy.orm import Session
from .. import models

def create_seats_for_showtime(db: Session, showtime_id: int):
    """Create 200 seats for an EXISTING showtime"""
    
    # Check if showtime exists
    showtime = db.query(models.Showtime).filter(models.Showtime.id == showtime_id).first()
    if not showtime:
        raise ValueError(f"Showtime with id {showtime_id} not found")
    
    # Check if seats already exist (to avoid duplicates)
    existing_seat = db.query(models.Seat).filter(models.Seat.showtime_id == showtime_id).first()
    if existing_seat:
        print(f"Seats already exist for showtime {showtime_id}, skipping")
        return
    
    # Generate 200 seats (20 rows x 10 columns)
    seats = []
    for row_num in range(10):  # A through J
        row_letter = chr(65 + row_num)
        for col_num in range(1, 21):  # 1 through 20
            seat = models.Seat(
                showtime_id=showtime_id,  # Use existing showtime ID
                seat_number=f"{row_letter}{col_num}",
                row=row_letter,
                number=col_num,
                is_booked=False,
                booked_by=None,
                booked_at=None
            )
            seats.append(seat)
    
    # Bulk insert all seats
    db.bulk_save_objects(seats)
    db.commit()