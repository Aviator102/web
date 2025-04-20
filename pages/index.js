import fetch from 'node-fetch';
import { URL } from 'url';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.startsWith('http')) {
    return res.status(400).send('URL inválida.');
  }

  try {
    // Requisição para o site original
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || 'text/html';
    const body = await response.text();

    // Reescrever os links relativos para absolutos
    const updatedBody = body.replace(/(src|href)="(?!http)([^"]+)"/g, (match, p1, p2) => {
      const absoluteUrl = new URL(p2, url).href; // Converte para URL absoluta
      return `${p1}="${absoluteUrl}"`;
    });

    // Responde com o HTML modificado
    res.setHeader('Content-Type', contentType);
    res.status(200).send(updatedBody);
  } catch (err) {
    console.error('Erro ao acessar a URL:', err);
    res.status(500).send('Erro ao buscar o conteúdo da URL.');
  }
}
