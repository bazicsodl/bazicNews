// 3. pages/posts/[slug].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';

export default function SinglePost() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (slug) {
      fetch(`https://bazicnews.onrender.com/api/posts/${slug}`)
        .then((res) => res.json())
        .then((data) => setPost(data))
        .catch((err) => console.error('Error fetching post:', err));
    }
  }, [slug]);

  if (!post) return <p className="p-4">Loading...</p>;

  return (
  <>
    <Head>
      <title>{post.title} | FinancePulse</title>
    </Head>
    <Navbar />
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-600 mb-4">
        {new Date(post.publishedAt).toLocaleDateString()} by {post.author}
      </p>
      <img
        src={post.thumbnail}
        alt="thumbnail"
        className="rounded mb-6 w-full"
      />

      <article className="prose max-w-none">
        <p>{post.content}</p>
      </article>

       {/* 👇 Add this for the original article */}
  {post.url && (
    <div className="mt-6">
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        Read original article →
      </a>
    </div>
  )}
</main>
  </>
);
}