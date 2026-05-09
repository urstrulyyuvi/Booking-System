import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiClock, FiUser, FiMail, FiPhone, FiFileText, FiCheckCircle } from 'react-icons/fi';
import { getExpertById, createBooking } from '../api/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

function BookingForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date') || '';
  const time = searchParams.get('time') || '';
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [form, setForm] = useState({ userName: '', userEmail: '', userPhone: '', notes: '' });

  useEffect(() => { getExpertById(id).then(res => { setExpert(res.data.data); setLoading(false); }).catch(() => setLoading(false)); }, [id]);

  const validate = () => {
    const e = {};
    if (!form.userName.trim()) e.userName = 'Name is required';
    if (!form.userEmail.trim()) e.userEmail = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.userEmail)) e.userEmail = 'Invalid email format';
    if (!form.userPhone.trim()) e.userPhone = 'Phone is required';
    else if (!/^[\d\s\-\+\(\)]{7,15}$/.test(form.userPhone)) e.userPhone = 'Invalid phone number';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' }); };

  const handleSubmit = async (e) => {
    e.preventDefault(); if (!validate()) return;
    setSubmitting(true); setServerError('');
    try { await createBooking({ expertId: id, date, timeSlot: time, ...form }); setSuccess(true); }
    catch (err) { setServerError(err.response?.data?.message || err.response?.data?.errors?.join(', ') || 'Booking failed.'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <LoadingSpinner message="Loading booking form..." />;
  if (success) {
    return (
      <div className="page booking-page">
        <div className="success-card">
          <FiCheckCircle className="success-icon" />
          <h2>Booking Confirmed!</h2>
          <p>Your session with <strong>{expert?.name}</strong> on <strong>{date}</strong> at <strong>{time}</strong> has been booked.</p>
          <p className="success-subtitle">Confirmation sent to <strong>{form.userEmail}</strong></p>
          <div className="success-actions">
            <Link to="/my-bookings" className="btn btn-primary">View My Bookings</Link>
            <Link to="/" className="btn btn-secondary">Browse More Experts</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page booking-page">
      <Link to={`/experts/${id}`} className="back-link"><FiArrowLeft /> Back to Expert</Link>
      <div className="booking-form-card">
        <h1>Book a Session</h1>
        <div className="booking-summary">
          <div className="summary-item"><FiUser /> <span>{expert?.name}</span></div>
          <div className="summary-item"><FiCalendar /> <span>{new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></div>
          <div className="summary-item"><FiClock /> <span>{time}</span></div>
        </div>
        {serverError && <div className="error-box">{serverError}</div>}
        <form onSubmit={handleSubmit} className="booking-form" noValidate>
          <div className="form-group">
            <label htmlFor="userName"><FiUser /> Full Name</label>
            <input id="userName" name="userName" type="text" value={form.userName} onChange={handleChange} placeholder="John Doe" className={errors.userName ? 'input-error' : ''} />
            {errors.userName && <span className="field-error">{errors.userName}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="userEmail"><FiMail /> Email</label>
            <input id="userEmail" name="userEmail" type="email" value={form.userEmail} onChange={handleChange} placeholder="john@example.com" className={errors.userEmail ? 'input-error' : ''} />
            {errors.userEmail && <span className="field-error">{errors.userEmail}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="userPhone"><FiPhone /> Phone</label>
            <input id="userPhone" name="userPhone" type="tel" value={form.userPhone} onChange={handleChange} placeholder="+1 234 567 8900" className={errors.userPhone ? 'input-error' : ''} />
            {errors.userPhone && <span className="field-error">{errors.userPhone}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="notes"><FiFileText /> Notes (optional)</label>
            <textarea id="notes" name="notes" value={form.notes} onChange={handleChange} placeholder="Any topics you'd like to discuss..." rows="3" />
          </div>
          <button type="submit" className="btn btn-primary btn-submit" disabled={submitting}>{submitting ? 'Booking...' : 'Confirm Booking'}</button>
        </form>
      </div>
    </div>
  );
}
export default BookingForm;
