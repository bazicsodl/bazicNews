import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const router = useRouter();

const handleLogin = async (e) => {
  e.preventDefault();
  
  try {
    // Show loading state (optional)
    setLoading(true);

    const response = await fetch('https://bazicnews.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: email.trim(), 
        password: password.trim() 
      }),
    });

    // Handle non-OK responses (400/401/404/500 etc)
    if (!response.ok) {
      // Try to get error message from JSON, fallback to text
      let errorMessage = 'Login failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Success case
    const { token } = await response.json();
    
    // Store token securely
    localStorage.setItem('token', token);
    
    // Redirect to protected route
    window.location.href = '/Home';
    
  } catch (err) {
    // User-friendly error messages
    let displayMessage = 'Login failed';
    
    if (err.message.includes('NetworkError')) {
      displayMessage = 'Network error - please check your connection';
    } 
    else if (err.message.includes('Failed to fetch')) {
      displayMessage = 'Server unavailable - please try again later';
    }
    else {
      displayMessage = err.message.replace(/<!.*?>/, '').trim(); // Remove HTML tags if any
    }

    console.error('Login error:', err);
    alert(displayMessage);
  } finally {
    setLoading(false); // Hide loading state
  }
};


  return (
    <>
      <Navbar />
      <form
        onSubmit={handleLogin}
        className="max-w-md mx-auto mt-10 p-4 border rounded shadow"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          type="email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <input
          type="password"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
          type="submit"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
   
              <p className="mt-4 text-center text-sm">
          Or login as admin?{' '}
          <Link href="/admin/aLogin" className="text-blue-600 hover:underline">
            login
          </Link>
          </p>
      </form>
    </>
  );
}
