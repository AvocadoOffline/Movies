import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import axios from 'axios';
import './BookingConfirmation.css';

function BookingConfirmation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    } else {
      navigate('/');
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/bookings/${bookingId}`);
      setBooking(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching booking:', error);
      setError('Failed to load booking details');
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!booking) return <div className="error-message">Booking not found</div>;

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="success-icon">✓</div>
        <h1 className="confirmation-title">Booking Confirmed!</h1>
        <p className="confirmation-subtitle">Your tickets have been booked successfully</p>

        <div className="booking-details-card">
          <div className="booking-header">
            <div>
              <div className="booking-label">Booking ID</div>
              <div className="booking-code">{booking.booking_id}</div>
            </div>
            
          </div>

          <div className="divider"></div>

          <div className="movie-section">
            <h3 className="section-title">🎬 Movie Details</h3>
            <div className="movie-title-large">{booking.movie_title}</div>
            <div className="movie-meta">
              <span>🎭 Hall {booking.hall}</span>
              <span>⭐ {booking.movie_rating}/10</span>
              <span>⏱️ 120 min</span>
            </div>
          </div>

          <div className="divider"></div>

          <div className="showtime-section">
            <h3 className="section-title">📅 Showtime</h3>
            <div className="showtime-date">
              {new Date(booking.show_time).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="showtime-time">
              {new Date(booking.show_time).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>

          <div className="divider"></div>

          <div className="seats-section">
            <h3 className="section-title">💺 Seats</h3>
            <div className="seats-grid-confirmation">
              {booking.seats.split(",").map((seat, index) => (
                <div key={index} className="seat-badge">
                  {seat}
                </div>
              ))}
            </div>
          </div>

          <div className="divider"></div>

          <div className="customer-section">
            <h3 className="section-title">👤 Customer Information</h3>
            <div className="customer-info">
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">{booking.customer_name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{booking.customer_email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone:</span>
                <span className="info-value">{booking.customer_phone}</span>
              </div>
            </div>
          </div>

          <div className="divider"></div>

          <div className="payment-section">
            <h3 className="section-title">💰 Payment Summary</h3>
            <div className="price-breakdown">
              <div className="price-row">
                <span>Ticket Price</span>
                <span>$12</span>
              </div>
              <div className="price-row">
                <span>Number of Tickets</span>
                <span>x{(booking.seats.split(",")).length}</span>
              </div>
              <div className="price-row total">
                <span>Total Amount</span>
                <span>${booking.total_amount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={handlePrint} className="btn-print">
            🖨️ Print Tickets
          </button>
          <Link to="/my-bookings" className="btn-view-bookings">
            📋 View My Bookings
          </Link>
          <Link to="/" className="btn-home">
            🏠 Back to Home
          </Link>
        </div>

        <div className="important-note">
          <p>📧 A confirmation email has been sent to your email address.</p>
          <p>⚠️ Please arrive 15 minutes before the showtime.</p>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;