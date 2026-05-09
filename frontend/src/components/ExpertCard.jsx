import { Link } from 'react-router-dom';
import { FiStar, FiBriefcase, FiArrowRight } from 'react-icons/fi';
const categoryColors = { Technology: '#6366f1', Business: '#f59e0b', Health: '#10b981', Education: '#3b82f6', Finance: '#8b5cf6', Design: '#ec4899' };
function ExpertCard({ expert }) {
  const color = categoryColors[expert.category] || '#6366f1';
  return (
    <div className="expert-card">
      <div className="expert-card-header" style={{ borderTopColor: color }}>
        <div className="expert-avatar">
          <img src={expert.avatar} alt={expert.name} onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${expert.name}&background=6366f1&color=fff&size=80`; }} />
        </div>
        <span className="expert-category-badge" style={{ background: color + '22', color }}>{expert.category}</span>
      </div>
      <div className="expert-card-body">
        <h3 className="expert-name">{expert.name}</h3>
        <p className="expert-bio">{expert.bio?.substring(0, 100)}...</p>
        <div className="expert-meta">
          <span className="expert-rating"><FiStar className="star-icon" /> {expert.rating}</span>
          <span className="expert-experience"><FiBriefcase /> {expert.experience} yrs</span>
        </div>
      </div>
      <Link to={`/experts/${expert._id}`} className="expert-card-link">View Profile <FiArrowRight /></Link>
    </div>
  );
}
export default ExpertCard;
