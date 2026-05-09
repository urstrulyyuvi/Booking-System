import { useNavigate } from 'react-router-dom';
import { FiClock, FiCheck, FiX } from 'react-icons/fi';
function SlotGrid({ slots, expertId }) {
  const navigate = useNavigate();
  const grouped = {};
  slots.forEach((slot) => { if (!grouped[slot.date]) grouped[slot.date] = []; grouped[slot.date].push(slot); });
  const sortedDates = Object.keys(grouped).sort();
  const formatDate = (dateStr) => { const d = new Date(dateStr + 'T00:00:00'); return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); };
  const handleSlotClick = (slot) => { if (slot.isBooked) return; navigate(`/book/${expertId}?date=${slot.date}&time=${slot.time}`); };
  return (
    <div className="slot-grid-container">
      <h2 className="section-title"><FiClock /> Available Time Slots</h2>
      {sortedDates.length === 0 && <p className="no-slots">No available slots at this time.</p>}
      {sortedDates.map((date) => (
        <div key={date} className="slot-date-group">
          <h3 className="slot-date-label">{formatDate(date)}</h3>
          <div className="slot-grid">
            {grouped[date].sort((a, b) => a.time.localeCompare(b.time)).map((slot) => (
              <button key={`${slot.date}-${slot.time}`} className={`slot-btn ${slot.isBooked ? 'booked' : 'available'}`} onClick={() => handleSlotClick(slot)} disabled={slot.isBooked} title={slot.isBooked ? 'Already booked' : 'Click to book'}>
                <span className="slot-time">{slot.time}</span>
                <span className="slot-status-icon">{slot.isBooked ? <FiX /> : <FiCheck />}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
export default SlotGrid;
