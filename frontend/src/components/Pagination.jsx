import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;
  const nums = [];
  for (let i = 1; i <= pages; i++) nums.push(i);
  return (
    <div className="pagination">
      <button className="page-btn" onClick={() => onPageChange(page - 1)} disabled={page <= 1}><FiChevronLeft /></button>
      {nums.map((n) => (<button key={n} className={`page-btn ${n === page ? 'active' : ''}`} onClick={() => onPageChange(n)}>{n}</button>))}
      <button className="page-btn" onClick={() => onPageChange(page + 1)} disabled={page >= pages}><FiChevronRight /></button>
    </div>
  );
}
export default Pagination;
