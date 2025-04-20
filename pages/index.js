import { useState } from 'react';

export default function Home() {
  const [inputUrl, setInputUrl] = useState('');
  const [proxyUrl, setProxyUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputUrl.startsWith('http')) {
      alert('A URL deve começar com http ou https');
      return;
    }
    setProxyUrl(`/api/proxy?url=${encodeURIComponent(inputUrl)}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🛡️ Mini Proxy via Vercel</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="https://exemplo.com"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          style={{ width: '80%', padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px' }}>
          Acessar
        </button>
      </form>
      <div style={{ marginTop: 20 }}>
        {proxyUrl && (
          <iframe
            src={proxyUrl}
            style={{ width: '100%', height: '80vh', border: '1px solid #ccc' }}
          ></iframe>
        )}
      </div>
    </div>
  );
}
