from .. import models, schemas
from fastapi import HTTPException, status, Response, Depends, APIRouter
from ..database import get_db
from sqlalchemy.orm import Session
from typing import List

router = APIRouter(
    prefix="/api/bookings",
    tags=["Booking"]
    )

@router.post("/")

# I receive:
#     showtime_id: int
#     seats: list
#     customer: dict
#     total_amount: int

def receive_and_create_bookings(booking_info: schemas.BookingCreate, db: Session = Depends(get_db)):
    movie = db.query(models.Movie).join(models.Showtime).filter(models.Showtime.id == booking_info.showtime_id).first()
    if not movie:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail = f"No movie found for showtime id {booking_info.showtime_id}.")
    required_showtime = db.query(models.Showtime).filter(models.Showtime.id == booking_info.showtime_id).first()
    if not required_showtime:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail = f"No showtime found with id {booking_info.showtime_id}.")

    seats = [db.query(models.Seat).filter(models.Seat.id == id).first().seat_number for id in booking_info.seats]

    booking_information = models.Booking(
        booking_id = booking_info.showtime_id * 1000 + len(seats),  # Simple unique ID generation
        customer_email = booking_info.customer["email"],
        customer_phone = booking_info.customer["phone"],
        customer_name = booking_info.customer["name"],
        
        movie_title = movie.title,
        movie_rating = movie.rating,
        
        hall = required_showtime.hall,
        showtime_id = booking_info.showtime_id,
        show_time = required_showtime.time,
        seats = ",".join(seats),  # Convert list to comma-separated string
        total_amount = booking_info.total_amount
    )
    db.add(booking_information)
    db.commit()
    db.refresh(booking_information)
    return booking_information

@router.get("/")
def get_bookings_by_email(email: str, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.customer_email == email).all()
    return booking

@router.get("/{id}")
def get_bookings_by_id(id: int, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.booking_id == id).first()
    if not booking:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail = f"No booking found with id {id}.")
    return booking

@router.delete("/delete/{id}")
def delete_booking(id: int, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.booking_id == id).first()
    if not booking:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail = f"No booking found with id {id}.")
    db.delete(booking)
    db.commit()
    return {"message": "Booking deleted successfully"}
