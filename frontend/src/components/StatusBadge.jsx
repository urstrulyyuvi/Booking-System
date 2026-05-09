function StatusBadge({ status }) {
  const cfg = { Pending: { color: '#f59e0b', bg: '#f59e0b18' }, Confirmed: { color: '#10b981', bg: '#10b98118' }, Completed: { color: '#6366f1', bg: '#6366f118' } };
  const c = cfg[status] || cfg.Pending;
  return <span className="status-badge" style={{ color: c.color, background: c.bg, borderColor: c.color + '44' }}>{status}</span>;
}
export default StatusBadge;
