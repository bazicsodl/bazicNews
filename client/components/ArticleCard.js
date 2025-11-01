import Link from 'next/link';

export default function ArticleCard({ post }) {
  return (
    <Link href={`/posts/${post.slug}`}>
      <a className="block border rounded-lg shadow p-4 hover:shadow-md transition">
        <img
          src={post.thumbnail || "https://via.placeholder.com/400x200"}
          alt="thumbnail"
          className="rounded mb-2 w-full"
        />
        <h2 className="text-lg font-semibold hover:underline">{post.title}</h2>
        <p className="text-sm text-gray-600 mb-1">
          {new Date(post.publishedAt).toLocaleDateString()}
        </p>
        <p className="text-sm">
          {post.content.substring(0, 100)}...
        </p>
      </a>
    </Link>
  );
}
