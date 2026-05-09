import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiBriefcase, FiArrowLeft } from 'react-icons/fi';
import { getExpertById } from '../api/api.js';
import { useSocket } from '../context/SocketContext.jsx';
import SlotGrid from '../components/SlotGrid.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const categoryColors = { Technology: '#6366f1', Business: '#f59e0b', Health: '#10b981', Education: '#3b82f6', Finance: '#8b5cf6', Design: '#ec4899' };

function ExpertDetail() {
  const { id } = useParams();
  const socket = useSocket();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getExpertById(id).then(res => { setExpert(res.data.data); }).catch(err => { setError(err.response?.data?.message || 'Failed to load expert'); }).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!socket || !expert) return;
    const handler = ({ expertId, date, time }) => {
      if (expertId !== id) return;
      setExpert(prev => ({ ...prev, availableSlots: prev.availableSlots.map(s => s.date === date && s.time === time ? { ...s, isBooked: true } : s) }));
    };
    socket.on('slotBooked', handler);
    return () => socket.off('slotBooked', handler);
  }, [socket, expert, id]);

  if (loading) return <LoadingSpinner message="Loading expert profile..." />;
  if (error) return <div className="page"><div className="error-box">{error}</div></div>;
  if (!expert) return null;
  const color = categoryColors[expert.category] || '#6366f1';

  return (
    <div className="page expert-detail-page">
      <Link to="/" className="back-link"><FiArrowLeft /> Back to Experts</Link>
      <div className="expert-profile-card">
        <div className="expert-profile-header" style={{ borderColor: color }}>
          <div className="expert-profile-avatar">
            <img src={expert.avatar} alt={expert.name} onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${expert.name}&background=6366f1&color=fff&size=120`; }} />
          </div>
          <div className="expert-profile-info">
            <span className="expert-category-badge" style={{ background: color + '22', color }}>{expert.category}</span>
            <h1>{expert.name}</h1>
            <div className="expert-meta">
              <span className="expert-rating"><FiStar className="star-icon" /> {expert.rating}/5.0</span>
              <span className="expert-experience"><FiBriefcase /> {expert.experience} years experience</span>
            </div>
            <p className="expert-full-bio">{expert.bio}</p>
          </div>
        </div>
      </div>
      <SlotGrid slots={expert.availableSlots} expertId={expert._id} />
    </div>
  );
}
export default ExpertDetail;
