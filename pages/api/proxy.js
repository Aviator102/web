export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.startsWith('http')) {
    return res.status(400).send('URL inválida.');
  }

  try {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || 'text/html';
    const body = await response.text();

    res.setHeader('Content-Type', contentType);
    res.status(200).send(body);
  } catch (err) {
    res.status(500).send('Erro ao buscar a URL.');
  }
}
