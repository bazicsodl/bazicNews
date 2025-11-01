// components/AdminSidebar.js
import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white fixed">
      <div className="p-4 font-bold text-xl border-b border-gray-700">Admin Panel</div>
      <nav className="mt-4 flex flex-col gap-2 px-4">
        <Link href="/admin" className="hover:bg-gray-700 p-2 rounded">Dashboard</Link>
        <Link href="/admin/posts" className="hover:bg-gray-700 p-2 rounded">Manage Posts</Link>
        <Link href="/admin/users" className="hover:bg-gray-700 p-2 rounded">Manage Users</Link>
        <Link href="/admin/email" className="hover:bg-gray-700 p-2 rounded">Send Email</Link>
      </nav>
    </aside>
  );
}
