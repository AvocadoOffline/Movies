import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import './MovieDetails.css';

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  useEffect(() => {
    fetchMovieDetails();
    fetchShowtimes();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/movies/${id}`);
      setMovie(response.data);
    } catch (error) {
      console.error('Error fetching movie:', error);
    }
  };

  const fetchShowtimes = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/movies/${id}/showtimes`);
      setShowtimes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching showtimes:', error);
      setLoading(false);
    }
  };

  const handleBookSeats = () => {
    if (selectedShowtime) {
      navigate(`/booking/${id}`, { state: { showtime: selectedShowtime, movie } });
    }
  };

  if (loading || !movie) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div className="movie-details">
      <div className="movie-details-layout">
        <div className="movie-details-poster">
          <img 
            src={movie.poster_url}
            alt={movie.title}
          />
        </div>
        <div className="movie-details-content">
          <h1 className="movie-details-title">{movie.title}</h1>
          <div className="movie-tags">
            <span className="movie-tag">{movie.genre}</span>
            <span className="movie-tag rating-tag">⭐{movie.rating}/10</span>
          </div>
          <p className="movie-description-full">{movie.description}</p>
          
          <div className="showtimes-section">
            <h3 className="showtimes-title">Showtimes</h3>
            <div className="showtimes-grid">
              {showtimes.map((showtime) => (
                <button
                  key={showtime.id}
                  onClick={() => setSelectedShowtime(showtime)}
                  className={`showtime-button ${selectedShowtime?.id === showtime.id ? 'selected' : ''}`}
                >
                  <div className="showtime-time">{new Date(showtime.time).toLocaleTimeString()}</div>
                  <div className="showtime-hall">Hall {showtime.hall}</div>
                  <div className="showtime-seats">{showtime.available_seats} seats left</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleBookSeats}
            disabled={!selectedShowtime}
            className="book-seats-button"
          >
            Select Seats
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;