import { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { getExperts } from '../api/api.js';
import ExpertCard from '../components/ExpertCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Pagination from '../components/Pagination.jsx';

const CATEGORIES = ['All', 'Technology', 'Business', 'Health', 'Education', 'Finance', 'Design'];

function ExpertListing() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1 });
  const [searchInput, setSearchInput] = useState('');

  const fetchExperts = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = { page, limit: 6 };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const res = await getExperts(params);
      setExperts(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) { setError(err.response?.data?.message || 'Failed to load experts'); }
    finally { setLoading(false); }
  }, [page, search, category]);

  useEffect(() => { fetchExperts(); }, [fetchExperts]);
  useEffect(() => { const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400); return () => clearTimeout(t); }, [searchInput]);

  return (
    <div className="page expert-listing-page">
      <div className="page-header">
        <h1>Find Your Expert</h1>
        <p className="page-subtitle">Book a session with top professionals across multiple domains</p>
      </div>
      <div className="filters-bar">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input id="expert-search" type="text" placeholder="Search experts by name..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
        </div>
        <div className="category-filter">
          <FiFilter className="filter-icon" />
          <select id="category-filter" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      {loading && <LoadingSpinner message="Finding experts..." />}
      {error && <div className="error-box">{error}</div>}
      {!loading && !error && (
        <>
          {experts.length === 0 ? (<div className="empty-state"><p>No experts found. Try adjusting your filters.</p></div>)
            : (<div className="experts-grid">{experts.map((expert) => <ExpertCard key={expert._id} expert={expert} />)}</div>)}
          <Pagination page={page} pages={pagination.pages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
export default ExpertListing;
