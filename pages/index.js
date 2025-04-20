import fetch from 'node-fetch';
import { URL } from 'url';
import path from 'path';

// Função para reescrever URLs relativas para absolutas
const rewriteUrl = (url, base) => {
  const parsedUrl = new URL(url, base);
  return parsedUrl.href;
};

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.startsWith('http')) {
    return res.status(400).send('URL inválida.');
  }

  try {
    // Fetch do conteúdo HTML original
    const response = await fetch(url);

    // Se a resposta não for bem-sucedida, envia um erro
    if (!response.ok) {
      return res.status(response.status).send('Erro ao acessar a URL solicitada.');
    }

    // Conteúdo da página HTML
    const body = await response.text();

    // Reescrever os links relativos para absolutos
    const updatedBody = body.replace(/(src|href)="(?!http)([^"]+)"/g, (match, p1, p2) => {
      return `${p1}="${rewriteUrl(p2, url)}"`;
    });

    // Definir tipo de conteúdo para o HTML
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(updatedBody);

  } catch (err) {
    console.error('Erro ao acessar a URL:', err);
    res.status(500).send('Erro ao buscar o conteúdo da URL.');
  }
}
