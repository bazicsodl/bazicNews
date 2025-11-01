import { useState } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <aside className={`bg-gray-900 text-white w-64 p-4 space-y-4 ${open ? '' : 'hidden'} md:block`}>
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <Link href="/admin/admin"><span className="block py-2 hover:bg-gray-700">Dashboard</span></Link>
        <Link href="/admin/users"><span className="block py-2 hover:bg-gray-700">Users</span></Link>
        <Link href="/admin/posts"><span className="block py-2 hover:bg-gray-700">Posts</span></Link>
        <Link href="/admin/email"><span className="block py-2 hover:bg-gray-700">Promotion Email</span></Link>
      </aside>
      <div className="flex-1">
        <header className="bg-gray-800 text-white p-4 md:hidden flex justify-between items-center">
          <h2 className="font-bold">Admin Panel</h2>
          <button onClick={() => setOpen(!open)} className="text-white">☰</button>
        </header>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
