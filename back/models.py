from .database import Base
from sqlalchemy import TIMESTAMP, Boolean, Column, Integer, String, text, ForeignKey
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key = True, nullable = False)
    email = Column(String, nullable = False, unique = True)
    password = Column(String, nullable = False)
    created_at = Column(TIMESTAMP(timezone = True), nullable = False, server_default = text("now()"))
    
class Movie(Base):
    __tablename__ = "movies"
    id = Column(Integer, primary_key = True, nullable = False)
    movie_id = Column(Integer, nullable = False, unique = True)
    title = Column(String, nullable = False)
    description = Column(String, nullable = False)
    rating = Column(Integer, nullable = False)
    genre = Column(String, nullable = False)
    poster_url = Column(String, nullable = False)
    release_date = Column(String, nullable = False)
    
    corresponding_showtimes = relationship("Showtime")

class Showtime(Base):
    __tablename__ = "showtimes"
    
    id = Column(Integer, primary_key = True, nullable = False)
    movie_id = Column(Integer, ForeignKey("movies.movie_id"), nullable = False)
    time = Column(TIMESTAMP(timezone = True), nullable = False)
    hall = Column(String, nullable = False)
    available_seats = Column(Integer, nullable = False, server_default = "200")
    total_seats = Column(Integer, nullable = False, server_default = "200")
    
    corresponding_seats = relationship("Seat")

class Seat(Base):
    __tablename__ = "seats"
    
    id = Column(Integer, primary_key=True, nullable=False)
    showtime_id = Column(Integer, ForeignKey("showtimes.id", ondelete="CASCADE"), nullable=False)
    seat_number = Column(String, nullable=False)  # e.g., "A1", "B12", "C5"
    row = Column(String, nullable=False)  # e.g., "A", "B", "C"
    number = Column(Integer, nullable=False)  # e.g., 1, 2, 3
    is_booked = Column(Boolean, nullable=False, server_default="false")
    booked_by = Column(String, ForeignKey("users.email"), nullable=True)  # Optional: who booked it
    booked_at = Column(TIMESTAMP(timezone=True), nullable=True)
    
    showtime = relationship("Showtime", back_populates="corresponding_seats")
