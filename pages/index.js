import fetch from 'node-fetch';
import { URL } from 'url';
import { Readable } from 'stream';

// Função auxiliar para transformar conteúdo de URL relativa em absoluta
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
    // Requisição do conteúdo da página original
    const response = await fetch(url);

    // Verifica o tipo de conteúdo para garantir que o proxy pode lidar com ele
    const contentType = response.headers.get('content-type');
    const body = await response.text();

    // Modifica links relativos (src, href) para links absolutos
    const updatedBody = body.replace(/(src|href)="(?!http)([^"]+)"/g, (match, p1, p2) => {
      return `${p1}="${rewriteUrl(p2, url)}"`;
    });

    // Envia o conteúdo alterado (HTML) para o navegador
    res.setHeader('Content-Type', contentType);
    res.status(200).send(updatedBody);

  } catch (error) {
    console.error('Erro ao tentar acessar a URL:', error);
    res.status(500).send('Erro ao acessar a URL solicitada.');
  }
}
