from .. import models, schemas
from fastapi import HTTPException, status, Response, Depends, APIRouter
from ..database import get_db
from sqlalchemy.orm import Session
from typing import List

router = APIRouter(
    prefix = "/api/movies",
    tags = ["Movies"]
)

@router.get("/", response_model = List[schemas.MovieResponse])
def get_movies(db: Session = Depends(get_db)):
    movies = db.query(models.Movie).all()
    return movies

@router.get("/{id}", response_model = schemas.MovieResponse)
def get_movie(id: int, db: Session = Depends(get_db)):
    movie = db.query(models.Movie).filter(models.Movie.movie_id == id).first()
    if not movie:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = f"Movie with id {id} not found.")
    return movie
