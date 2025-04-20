// pages/api/proxy.js
export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL obrigatória' });
  }

  try {
    const fetchRes = await fetch(url);
    const data = await fetchRes.text(); // ou .json() se for API

    res.status(200).send(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar o conteúdo.' });
  }
}
