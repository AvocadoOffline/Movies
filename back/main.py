from contextlib import asynccontextmanager
from datetime import datetime

from .utils.seats import create_seats_for_showtime
from .utils.timestamp import random_timestamp_after
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import engine, get_db
from .routers import movie, showtimes
from .getMovies import load_movies, genres
models.Base.metadata.create_all(bind = engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    movie_list = load_movies()
    if movie_list:
        db = next(get_db())
        existing = db.query(models.Movie).first()
        if not existing:
            try:
                for movie in movie_list:
                    new_movie = models.Movie(
                        title = movie["title"],
                        description = movie["overview"],
                        rating = int(movie["vote_average"]),
                        genre = [genre["name"] for genre in genres if genre["id"] == movie["genre_ids"][0]][0],
                        poster_url = "https://image.tmdb.org/t/p/w500" + movie["poster_path"],
                        release_date = movie["release_date"],
                        movie_id = movie["id"]
                    )
                    db.add(new_movie)
                db.commit()
                
            except:
                print(f"❌ Error adding movies to the database.")
                db.rollback()
            finally:
                db.close()
    if not db.query(models.Showtime).first():
        for movie in movie_list:
            for i in range(3):
                halls = ["A", "B", "C"]
                new_showtime = models.Showtime(
                                movie_id = movie["id"],
                                time = f"{random_timestamp_after(datetime.now())}",
                                hall = halls[i],
                                available_seats = 200,
                                total_seats = 200
                            )
                db.add(new_showtime)
        db.commit()
    all_showtimes = db.query(models.Showtime).all()
    if db.query(models.Seat).first() is None:
        for showtime in all_showtimes:
            create_seats_for_showtime(db, showtime.id)
    yield
    
app = FastAPI(lifespan = lifespan)
    
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

app.include_router(movie.router)
app.include_router(showtimes.router)

@app.get("/")
async def root():
    return {"message": "gurt yo"}
