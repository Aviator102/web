import fetch from 'node-fetch';
import { URL } from 'url';

const rewriteUrl = (url, base) => {
  try {
    return new URL(url, base).href;
  } catch (e) {
    return url; // Fallback para evitar erro com URLs inválidas
  }
};

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.startsWith('http')) {
    return res.status(400).send('URL inválida.');
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(response.status).send('Erro ao acessar a URL solicitada.');
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
      return res.status(415).send('O conteúdo retornado não é HTML.');
    }

    const body = await response.text();

    const updatedBody = body.replace(/(src|href)=["'](?!https?:\/\/|\/\/)([^"']+)["']/g, (match, p1, p2) => {
      return `${p1}="${rewriteUrl(p2, url)}"`;
    });

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(updatedBody);

  } catch (err) {
    console.error('Erro ao acessar a URL:', err);
    res.status(500).send('Erro ao buscar o conteúdo da URL.');
  }
}
