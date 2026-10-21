export function AdminLoading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="container-page py-16" role="status" aria-live="polite">
      <p className="text-sm text-ink-muted">{label}</p>
    </div>
  );
}
