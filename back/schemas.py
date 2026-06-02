from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional, Literal

class MovieBase(BaseModel):
    title: str
    description: Optional[str] = None
    release_date: Optional[datetime] = None
    genre: Optional[str] = None
    
class MovieResponse(MovieBase):
    rating: int
    poster_url: str
    movie_id: int
    
class MovieShowtime(BaseModel):
    id: int
    movie_id: int
    time: datetime
    hall: str
    available_seats: int
    total_seats: int
    
class SeatResponse(BaseModel):
    id: int
    is_booked: bool
    seat_number: str
    model_config = ConfigDict({"from_attributes": True})

class BookingCreate(BaseModel):
    showtime_id: int
    seats: list
    customer: dict
    total_amount: int