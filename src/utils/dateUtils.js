export function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// Returns { label, className } for the due-date "stamp" badge
export function getDueStatus(dueDate, status) {
  if (status === 'returned') return { label: 'Returned', className: 'ok' };
  const d = daysUntil(dueDate);
  if (d < 0) return { label: `Overdue ${Math.abs(d)}d`, className: 'overdue' };
  if (d <= 3) return { label: `Due in ${d}d`, className: 'due-soon' };
  return { label: `Due ${formatDate(dueDate)}`, className: 'ok' };
}
