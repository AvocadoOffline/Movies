import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import './MovieList.css';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/movies');
      setMovies(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load movies');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="movie-list-container">
      <h1 className="movie-list-title">Now Showing</h1>
      <div className="movies-grid">
        {movies.map((movie) => (
          <MovieCard movie={movie} />
        ))}
      </div>
    </div>
  );
}

function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <img 
        src={movie.poster_url} 
        alt={movie.title}
        className="movie-poster"
      />
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-genre">{movie.genre}</p>
        <p className="movie-description">{movie.description}</p>
        <div className="movie-meta">
          <span className="movie-rating">⭐ {movie.rating}/10</span>
          <span className="movie-duration">120 min</span>
        </div>
        <Link to={`/movie/${movie.movie_id}`} className="book-button">
          Book Now
        </Link>
      </div>
    </div>
  );
}

export default MovieList;