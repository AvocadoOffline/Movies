
from .. import models, schemas
from fastapi import HTTPException, status, Response, Depends, APIRouter
from ..database import get_db
from sqlalchemy.orm import Session
from typing import List, Optional

router = APIRouter(
    prefix = "/api/movies",
    tags = ["showtimes"]
)

@router.get("/{movie_id}/showtimes", response_model = List[schemas.MovieShowtime])
def get_showtimes_details(movie_id: int, db: Session = Depends(get_db)): 
    corr_showtimes = db.query(models.Showtime).filter(models.Showtime.movie_id == movie_id).all()
    if not corr_showtimes:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail = f"No showtimes found for movie with id {movie_id}.")
    print(corr_showtimes)
    return corr_showtimes

@router.get("/showtimes/{showtime_id}/seats", response_model = List[schemas.SeatResponse])
def get_seats(showtime_id: int, db: Session = Depends(get_db)):
    corr_showtimes = db.query(models.Seat).filter(models.Seat.showtime_id == showtime_id).all()
    if not corr_showtimes:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail = f"No seats found for showtime with id {showtime_id}.")
    return corr_showtimes