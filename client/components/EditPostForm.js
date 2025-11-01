// components/EditPostForm.js
import { useState, useEffect } from 'react';

export default function EditPostForm({ post, onSave, onCancel }) {
  const [form, setForm] = useState(post || {});

  useEffect(() => {
    setForm(post);
  }, [post]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="bg-white p-4 border rounded shadow">
      <h2 className="text-lg font-bold mb-4">Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" className="w-full p-2 mb-2 border rounded" value={form.title} onChange={handleChange} />
        <input name="author" className="w-full p-2 mb-2 border rounded" value={form.author} onChange={handleChange} />
        <input name="thumbnail" className="w-full p-2 mb-2 border rounded" value={form.thumbnail} onChange={handleChange} />
        <textarea name="content" className="w-full p-2 mb-2 border rounded" value={form.content} onChange={handleChange} rows={5} />
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
          <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
