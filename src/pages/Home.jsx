import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, RefreshCcw } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [short, setShort] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShorten = async () => {
    if (!url) return;

    setLoading(true);
    try {
      const res = await fetch('/api/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      setShort(`${data.short}`);
    } catch (err) {
      alert("Gagal mempersingkat URL");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUrl('');
    setShort('');
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(short);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset "Copied!" setelah 2 detik
    } catch (err) {
      alert('Gagal menyalin!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-2xl font-bold">Energeek Shorten URL</h1>

      <Input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste your URL..."
        className="border p-2 w-full max-w-md rounded"
        disabled={loading || short}
      />

      {!short ? (
        <Button
          onClick={handleShorten}
          className="text-white px-4 py-2 rounded-xl disabled:opacity-50"
          disabled={loading || !url}
        >
          {loading ? 'Processing...' : 'Shorten'}
        </Button>
      ) : (
        <Button
          onClick={handleReset}
          className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
        >
          <RefreshCcw className='w-4 mr-2' /> Shorten Baru
        </Button>
      )}

      {short && (
        <div className="flex items-center gap-2 text-green-600">
          <span>Shortened URL:</span>
          <a
            className="underline"
            href={short}
            target="_blank"
            rel="noopener noreferrer"
          >
            {short}
          </a>
          <Button size="icon" variant="outline" onClick={handleCopy}>
            <Copy className="w-4" />
          </Button>
          {copied && <span className="text-sm text-gray-500">Copied! ✅</span>}
        </div>
      )}
    </div>
  );
}
