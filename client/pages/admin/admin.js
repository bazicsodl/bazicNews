import AdminLayout from '../../components/AdminLayout';

// pages/admin/index.js
import Sidebar from '../../components/Sidebar';

export default function AdminDashboard({ stats }) {
  return (
    <div className="flex">
      <AdminLayout />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-100 rounded shadow">
            <h2 className="text-xl font-semibold">Total Users</h2>
            <p className="text-3xl">{stats.users}</p>
          </div>
          <div className="p-4 bg-green-100 rounded shadow">
            <h2 className="text-xl font-semibold">Posts</h2>
            <p className="text-3xl">{stats.posts}</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded shadow">
            <h2 className="text-xl font-semibold">Emails Sent</h2>
            <p className="text-3xl">{stats.emails}</p>
          </div>
          <div className="p-4 bg-red-100 rounded shadow">
            <h2 className="text-xl font-semibold">Admins</h2>
            <p className="text-3xl">{stats.admins}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Optional: Fetch stats from API
export async function getServerSideProps() {
  const res = await fetch('https://bazicnews.onrender.com/api/admin/stats');
  const data = await res.json();

  return {
    props: {
      stats: data
    }
  };
}
