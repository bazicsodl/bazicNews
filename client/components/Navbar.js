import React, { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar({ categories = [], onSelectCategory }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-orange-600 shadow p-4 mb-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Bazic News</h1>

        {/* Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white md:hidden focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          <a href="/Home" className="text-white hover:text-orange-200">Home</a>
          <a href="/about" className="text-white hover:text-orange-200">About</a>
          <a href="/contact" className="text-white hover:text-orange-200">Contact</a>
          <a href="/Login" className="text-white hover:text-orange-200">Login</a>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2 px-2">
          <a href="/Home" className="block text-white hover:text-orange-200">Home</a>
          <a href="/about" className="block text-white hover:text-orange-200">About</a>
          <a href="/contact" className="block text-white hover:text-orange-200">Contact</a>
          <a href="/Login" className="block text-white hover:text-orange-200">Login</a>
          
          {/* Categories Section */}
          <div className="pt-2 border-t border-orange-400 mt-2">
            <h3 className="text-white font-semibold mb-2">Categories</h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onSelectCategory(cat);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left text-white hover:bg-orange-400 px-2 py-1 rounded"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}