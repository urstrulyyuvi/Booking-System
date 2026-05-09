import { useState } from 'react';
import { FiSearch, FiInbox } from 'react-icons/fi';
import { getBookingsByEmail } from '../api/api.js';
import BookingCard from '../components/BookingCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

function MyBookings() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault(); if (!email.trim()) return;
    setLoading(true); setError(''); setSearched(true);
    try { const res = await getBookingsByEmail(email.trim()); setBookings(res.data.data); }
    catch (err) { setError(err.response?.data?.message || 'Failed to load bookings'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page my-bookings-page">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p className="page-subtitle">Enter your email to view all your booked sessions</p>
      </div>
      <form onSubmit={handleSearch} className="email-search-form">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input id="email-search" type="email" placeholder="Enter your email address..." value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>Search</button>
      </form>
      {loading && <LoadingSpinner message="Loading your bookings..." />}
      {error && <div className="error-box">{error}</div>}
      {!loading && searched && bookings.length === 0 && (<div className="empty-state"><FiInbox className="empty-icon" /><p>No bookings found for this email.</p></div>)}
      {!loading && bookings.length > 0 && (<div className="bookings-list">{bookings.map((b) => <BookingCard key={b._id} booking={b} />)}</div>)}
    </div>
  );
}
export default MyBookings;
