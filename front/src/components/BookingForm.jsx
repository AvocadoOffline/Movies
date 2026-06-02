import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import './BookingForm.css';

function BookingForm() {
  const { movieId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showtime, movie } = location.state || {};
  
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (showtime) {
      fetchSeats();
    } else {
      navigate('/');
    }
  }, [showtime]);

  const fetchSeats = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/movies/showtimes/${showtime.id}/seats`);
      console.log(response.data)
      setSeats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching seats:', error);
      setLoading(false);
    }
  };

  const toggleSeat = (seatId) => {
    const seat = seats.find(s => s.id === seatId);
    if (seat.is_booked) return;
    
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    setSubmitting(true);
    try {
      const bookingData = {
        showtime_id: showtime.id,
        seats: selectedSeats,
        customer: customerInfo,
        total_amount: selectedSeats.length * (showtime.price || 12)
      };
      
      const response = await axios.post('http://127.0.0.1:8000/api/bookings', bookingData);
      navigate(`/booking-confirmation/${response.data.booking_id}`);
    } catch (error) {
      alert('Booking failed. Please try again.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div className="booking-container">
      <div className="booking-card">
        <h1 className="booking-title">Select Your Seats</h1>
        
        <div className="movie-info-card">
          <div className="movie-info-title">{movie?.title}</div>
          <div className="movie-info-datetime">
            {new Date(showtime?.time).toLocaleDateString()} at {new Date(showtime?.time).toLocaleTimeString()} - Hall {showtime?.hall}
          </div>
        </div>

        <div className="cinema-screen">
          <div className="screen-label">🎬 SCREEN</div>
          
          <div className="seats-grid">
            {seats.map((seat) => (
              <button
                key={seat.id}
                onClick={() => toggleSeat(seat.id)}
                disabled={seat.is_booked}
                className={`seat-button ${
                  seat.is_booked 
                    ? 'seat-booked' 
                    : selectedSeats.includes(seat.id)
                      ? 'seat-selected'
                      : 'seat-available'
                }`}
              >
                {seat.seat_number}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={customerInfo.name}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              required
              value={customerInfo.email}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              required
              value={customerInfo.phone}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="booking-summary">
            <div className="summary-title">Booking Summary:</div>
            <div className="summary-text">
              Seats: {selectedSeats.map(id => {
                const seat = seats.find(s => s.id === id);
                return seat?.seat_number;
              }).join(', ')}
            </div>
            <div className="summary-text">Price per seat: ${showtime?.price || 12}</div>
            <div className="summary-total">
              Total: ${selectedSeats.length * (showtime?.price || 12)}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || selectedSeats.length === 0}
            className="confirm-button"
          >
            {submitting ? 'Processing...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;