import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import StatusBadge from './StatusBadge.jsx';
function BookingCard({ booking }) {
  const formatDate = (dateStr) => { const d = new Date(dateStr + 'T00:00:00'); return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }); };
  return (
    <div className="booking-card">
      <div className="booking-card-top">
        <h3 className="booking-expert-name"><FiUser /> {booking.expertName}</h3>
        <StatusBadge status={booking.status} />
      </div>
      <div className="booking-card-details">
        <span><FiCalendar /> {formatDate(booking.date)}</span>
        <span><FiClock /> {booking.timeSlot}</span>
      </div>
      {booking.notes && <p className="booking-notes">"{booking.notes}"</p>}
      <div className="booking-card-footer"><span className="booking-created">Booked: {new Date(booking.createdAt).toLocaleDateString()}</span></div>
    </div>
  );
}
export default BookingCard;
