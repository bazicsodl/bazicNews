import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function PromotionEmail() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const sendEmail = async (e) => {
    e.preventDefault();
    const res = await fetch('https://bazicnews.onrender.com/api/send-promo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, body }),
    });

    if (res.ok) alert('Emails sent!');
    else alert('Failed to send');
  };

  return (
    <AdminLayout>
      <h2 className="text-xl font-bold mb-4">Send Promotion Email</h2>
      <form onSubmit={sendEmail}>
        <input className="w-full p-2 mb-2 border rounded" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Email Subject" />
        <textarea className="w-full p-2 mb-2 border rounded" rows="6" value={body} onChange={e => setBody(e.target.value)} placeholder="Email Body" />
        <button className="bg-blue-600 text-white p-2 rounded" type="submit">Send</button>
      </form>
    </AdminLayout>
  );
}
