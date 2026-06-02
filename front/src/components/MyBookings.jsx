import React, { useState } from 'react';
import axios from 'axios';
import './MyBookings.css';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [searched, setSearched] = useState(false);

  const fetchBookings = async () => {
    if (!email) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/bookings?email=${email}`);
      setBookings(response.data);
      setSearched(true);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/bookings/delete/${bookingId}`);
        fetchBookings();
      } catch (error) {
        alert('Failed to cancel booking');
      }
    }
  };

  return (
    <div className="bookings-container">
      <div className="bookings-card">
        <h1 className="bookings-title">My Bookings</h1>
        
        <div className="search-section">
          <input
            type="email"
            placeholder="Enter your email to view bookings"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="search-input"
          />
          <button onClick={fetchBookings} className="search-button">
            Search
          </button>
        </div>

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}
        
        {searched && !loading && bookings.length === 0 && (
          <div className="empty-state">
            No bookings found for this email address.
          </div>
        )}

        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-item">
              <div className="booking-header">
                <div>
                  <h3 className="booking-movie-title">{booking.movie_title}</h3>
                  <div className="booking-details">
                    <div className="booking-detail-item">
                      📅 {new Date(booking.show_time).toLocaleDateString()}
                    </div>
                    <div className="booking-detail-item">
                      ⏰ {new Date(booking.show_time).toLocaleTimeString()}
                    </div>
                    <div className="booking-detail-item">
                      🎭 Hall {booking.hall_number}
                    </div>
                    <div className="booking-detail-item">
                      💺 Seats: {booking.seats}
                    </div>
                    <div className="booking-detail-item">
                      💰 Total: ${booking.total_amount}
                    </div>
                    <div className="booking-detail-item">
                      Booking ID: {booking.booking_id}
                    </div>
                  </div>
                </div>
                <div>
                    <button
                      onClick={() => handleCancelBooking(booking.booking_id)}
                      className="cancel-button"
                    >
                      Cancel Booking
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyBookings;