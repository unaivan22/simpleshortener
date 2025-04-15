import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, RefreshCcw } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [short, setShort] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const isValidUrl = (string) => {
    try {
      const parsed = new URL(string);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  const handleShorten = async () => {
    if (!isValidUrl(url)) {
      setError('URL harus dimulai dengan http:// atau https://');
      return;
    }

    setError('');
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
    setError('');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(short);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Gagal menyalin!');
    }
  };

  return (
    <BackgroundGradientAnimation>
      <div className='container absolute z-50'>
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
          <div className='flex flex-col items-center text-center'>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">Energeek Shorten URL</h1>
            <p className='bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20'>Transform your long URLs into short, manageable links</p>
          </div>

          <Input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (e.target.value && !isValidUrl(e.target.value)) {
                setError('URL harus dimulai dengan http:// atau https://');
              } else {
                setError('');
              }
            }}
            placeholder="Paste your URL..."
            className="border p-2 w-full max-w-sm rounded-xl bg-white"
            disabled={loading || short}
          />
          {error && <p className="text-white text-sm">{error}</p>}

          {!short ? (
            <Button
              onClick={handleShorten}
              className="text-white px-4 py-2 rounded-xl disabled:opacity-50 max-w-sm w-full"
              disabled={loading || !url || !!error}
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
            <div className="flex items-center gap-2 text-green-600 px-4 py-2 bg-stone-100 rounded-lg border">
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
      </div>
      <div className="fixed left-1/2 bottom-6 transform -translate-x-1/2">
        <p className='text-sm font-light opacity-80 text-white'>2025 - @energeek</p>
      </div>
    </BackgroundGradientAnimation>
  );
}
