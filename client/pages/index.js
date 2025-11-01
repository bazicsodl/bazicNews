// pages/index.js
import Link from 'next/link';

export default function HeroPage() {
  return (
    <div style={styles.container}>
      <div style={styles.heroBox}>
        <h1 style={styles.heading}>Welcome to Bazic News</h1>
        <p style={styles.subText}>
          Stay updated with the latest in Crypto, Stocks, and Finance.
        </p>
        <Link href="/Home">
          <button style={styles.button}>Enter App</button>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    color: '#fff',
    padding: '2rem',
  },
  heroBox: {
    textAlign: 'center',
    maxWidth: '600px',
  },
  heading: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  subText: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
  },
  button: {
    padding: '0.8rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
};
