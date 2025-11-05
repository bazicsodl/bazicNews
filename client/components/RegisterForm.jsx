import { useState } from 'react';
import { useRouter } from 'next/router';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
  username: '',
  email: '',
  password: '',
  newsletter: false, // changed from subscribe
});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Register the user
      const registerRes = await fetch('https://bazicnews.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        return alert(registerData.message || 'Registration failed.');
      }

      // Step 2: Auto-login after successful registration
      // Auto-login with email, not username
const loginRes = await fetch('https://bazicnews.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: formData.email,
    password: formData.password,
  }),
});


      const loginData = await loginRes.json();

      if (loginRes.ok) {
        localStorage.setItem('token', loginData.token);
        router.push('/Home');
      } else {
        alert('Auto-login failed. Try logging in manually.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded shadow">
      <input
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <label className="flex items-center space-x-2 text-sm">
        <input
          type="checkbox"
          name="newsletter"
          checked={formData.newsletter}
          onChange={handleChange}
        />
        <span>Sign me up for the newsletter</span>
      </label>
      <button className="w-full bg-blue-600 text-white py-2 rounded" type="submit">
        Register & Login
      </button>
    </form>
  );
}
