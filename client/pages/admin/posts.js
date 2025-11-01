import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    thumbnail: '',
    category: '',
    tags: ''
  });
  // Add pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    limit: 10 // Posts per page
  });

  useEffect(() => {
    fetchPosts();
  }, [pagination.currentPage]); // Refetch when page changes

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `http://localhost:2500/api/posts?page=${pagination.currentPage}&limit=${pagination.limit}`
      );
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to fetch posts');

      setPosts(Array.isArray(data.posts) ? data.posts : []);
      setPagination({
        ...pagination,
        totalPages: data.totalPages || 1,
        totalPosts: data.total || 0
      });
    } catch (err) {
      console.error('Error fetching posts:', err);
      setPosts([]);
    }
  };

  // Pagination controls
  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination({ ...pagination, currentPage: page });
    }
  };

 const handleDelete = async (id) => {
    await fetch(`http://localhost:2500/api/posts/${id}`, {
      method: 'DELETE',
    });
    setPosts(posts.filter(p => p._id !== id));
  };

  const handleEdit = (post) => {
    setEditingPost(post._id);
    setFormData({
      title: post.title,
      excerpt: post.excerpt || '',
      content: post.content,
      author: post.author || '',
      thumbnail: post.thumbnail || '',
      category: post.category || '',
      tags: post.tags ? post.tags.join(', ') : ''
    });
  };

 const handleCreateOrUpdate = async (e) => {
  e.preventDefault();

  // 1. Get the token from localStorage (after login)
  const token = localStorage.getItem('token');

  if (!token) {
    alert('You must be logged in to create/update posts!');
    return;
  }

  const payload = {
    ...formData,
    tags: formData.tags.split(',').map(tag => tag.trim()),
  };

  try {
    if (editingPost) {
      // PUT request (update)
      await fetch(`http://localhost:2500/api/posts/${editingPost}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token
        },
        body: JSON.stringify(payload),
      });
      setEditingPost(null);
    } else {
      // POST request (create)
      await fetch('http://localhost:2500/api/posts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token
        },
        body: JSON.stringify(payload),
      });
    }

    // Reset form
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      thumbnail: '',
      category: '',
      tags: '',
    });

    fetchPosts(); // Refresh the posts list
  } catch (err) {
    console.error('Error:', err);
    alert('Failed to save post. Check console for details.');
  }
};


  return (
    <AdminLayout>
      <h2 className="text-xl font-bold mb-4 text-gray-800">Manage Posts</h2>

     {/* Create/Edit Form */}
      <form onSubmit={handleCreateOrUpdate} className="mb-6 space-y-4 bg-white p-6 rounded-lg shadow-md">
        <h3 className="font-semibold text-lg text-gray-800">
          {editingPost ? 'Edit Post' : 'Create New Post'}
        </h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              type="text" 
              id="title"
              placeholder="Title" 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
              className="w-full p-2 border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              required 
            />
          </div>
          
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <input 
              type="text" 
              id="excerpt"
              placeholder="Excerpt" 
              value={formData.excerpt} 
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} 
              className="w-full p-2 border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea 
              id="content"
              placeholder="Content" 
              value={formData.content} 
              onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
              className="w-full p-2 border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              rows="4" 
              required 
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input 
              type="text" 
              id="author"
              placeholder="Author" 
              value={formData.author} 
              onChange={(e) => setFormData({ ...formData, author: e.target.value })} 
              className="w-full p-2 border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          
          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
            <input 
              type="text" 
              id="thumbnail"
              placeholder="Thumbnail URL" 
              value={formData.thumbnail} 
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })} 
              className="w-full p-2 border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input 
              type="text" 
              id="category"
              placeholder="Category" 
              value={formData.category} 
              onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
              className="w-full p-2 border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input 
              type="text" 
              id="tags"
              placeholder="Tags (comma-separated)" 
              value={formData.tags} 
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })} 
              className="w-full p-2 border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>

          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {editingPost ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </form>

      {/* List of Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
             <div>
              <h4 className="text-xl font-semibold text-gray-800">{post.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{post.excerpt}</p>
              <p className="text-gray-700 mt-2">{post.content}</p>
              <p className="text-sm text-gray-500 mt-3">
                <strong>Author:</strong> {post.author} | <strong>Category:</strong> {post.category}
              </p>
              {post.tags && <p className="text-xs text-gray-500 mt-1">Tags: {post.tags.join(', ')}</p>}
            </div>
            <div className="space-x-3 mt-3">
              <button 
                className="text-blue-600 hover:text-blue-800 focus:outline-none" 
                onClick={() => handleEdit(post)}
              >
                Edit
              </button>
              <button 
                className="text-red-600 hover:text-red-800 focus:outline-none" 
                onClick={() => handleDelete(post._id)}
              >
                Delete
              </button>
           </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{' '}
          {Math.min(pagination.currentPage * pagination.limit, pagination.totalPosts)} of{' '}
          {pagination.totalPosts} posts
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => goToPage(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className={`px-4 py-2 border rounded-md ${
              pagination.currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            Previous
          </button>
          
          {/* Page numbers */}
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-4 py-2 border rounded-md ${
                page === pagination.currentPage
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => goToPage(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className={`px-4 py-2 border rounded-md ${
              pagination.currentPage === pagination.totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}