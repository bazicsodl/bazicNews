// components/CategoriesBar.js
export default function CategoriesBar({ categories, selectedCategory, setCategory }) {
  return (
    <div className="bg-orange-100 px-6 py-2 shadow-sm flex gap-4 overflow-x-auto">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap
            ${selectedCategory === cat ? 'bg-orange-500 text-white' : 'bg-white text-gray-800 border'}
          `}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
