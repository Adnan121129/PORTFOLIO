'use client';

/** Last-resort boundary when the root layout itself fails. Kept dependency-free. */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'system-ui, sans-serif',
          background: '#f4f2ed',
          color: '#14161a',
        }}
      >
        <main style={{ maxWidth: 520, padding: 24 }}>
          <h1 style={{ fontSize: 32, margin: 0 }}>Something went wrong.</h1>
          <p style={{ color: '#4c525c', lineHeight: 1.6 }}>
            The site hit an unexpected error. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 16,
              padding: '10px 18px',
              borderRadius: 999,
              border: 0,
              background: '#14161a',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
