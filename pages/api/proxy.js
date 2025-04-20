export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.startsWith('http')) {
    return res.status(400).send('URL inválida.');
  }

  try {
    const fetchRes = await fetch(url);
    const contentType = fetchRes.headers.get('content-type') || 'text/html';
    const data = await fetchRes.text();

    res.setHeader('Content-Type', contentType);
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send('Erro ao buscar a URL.');
  }
}
