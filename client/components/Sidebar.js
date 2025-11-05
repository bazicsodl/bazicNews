// components/Sidebar.js
import React from "react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4 hidden md:block">
      <h2 className="text-2xl font-bold mb-6">Admin</h2>
      <ul className="space-y-4">
        <li>
          <Link href="/admin" className="hover:underline">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/admin/users" className="hover:underline">
            Users
          </Link>
        </li>
        <li>
          <Link href="/admin/posts" className="hover:underline">
            Posts
          </Link>
        </li>
        <li>
          <Link href="/admin/email" className="hover:underline">
            Emails
          </Link>
        </li>
      </ul>
    </aside>
  );
}
