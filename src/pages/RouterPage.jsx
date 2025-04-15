import React, { useEffect } from 'react'
import { HashRouter as Router, Route, Routes, useParams } from 'react-router-dom'
import Home from './Home'
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';

function Redirector() {
  const { code } = useParams();

  useEffect(() => {
    // Redirect browser langsung ke backend, biar PHP yang handle redirect
    window.location.href = `/api/api.php?code=${code}`;
  }, [code]);

  return <BackgroundGradientAnimation>
    <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
        <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
          Redirecting...
        </p>
      </div>
  </BackgroundGradientAnimation>;
}

export default function RouterPage() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:code" element={<Redirector />} />
      </Routes>
    </Router>
  )
}
