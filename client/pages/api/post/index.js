import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const backendRes = await axios.get(`${process.env.BACKEND_URL}/api/posts`, {
        headers: {
          Authorization: req.headers.authorization || '',
        },
      });
      res.status(200).json(backendRes.data);
    } catch (err) {
      res.status(500).json({ message: 'Failed to load posts' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
