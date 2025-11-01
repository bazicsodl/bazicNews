// components/Sidebar.js
import React from 'react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4 hidden md:block">
      <h2 className="text-2xl font-bold mb-6">Admin</h2>
      <ul className="space-y-4">
        <li><a href="/admin" className="hover:underline">Dashboard</a></li>
        <li><a href="/admin/users" className="hover:underline">Users</a></li>
        <li><a href="/admin/posts" className="hover:underline">Posts</a></li>
        <li><a href="/admin/emails" className="hover:underline">Emails</a></li>
      </ul>
    </aside>
  );
}
