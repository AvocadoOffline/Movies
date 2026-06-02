import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import BookingForm from './components/BookingForm';
import BookingConfirmation from './components/BookingConfirmation';
import MyBookings from './components/MyBookings';
import Navbar from './components/Navbar';
import './styles/global.css'; // Import global styles

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/booking/:movieId" element={<BookingForm />} />
          <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;