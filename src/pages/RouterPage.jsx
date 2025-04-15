import React, { useEffect } from 'react'
import { HashRouter as Router, Route, Routes, useParams } from 'react-router-dom'
import Home from './Home'

function Redirector() {
  const { code } = useParams();

  useEffect(() => {
    // Redirect browser langsung ke backend, biar PHP yang handle redirect
    window.location.href = `/api/api.php?code=${code}`;
  }, [code]);

  return <p className="text-center mt-10">Redirecting...</p>;
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
