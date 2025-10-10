import React, { useState } from 'react'
import { SignupForm } from './components/SignupForm'
import { Chatbot } from './components/Chatbot'

export function App() {
  const [apiBase, setApiBase] = useState(import.meta.env.VITE_API_BASE || 'http://localhost:4000')
  return (
    <div className="app">
      <header className="header">
        <div className="brand">Acme Bank</div>
        <div className="env">
          Backend: {apiBase}
        </div>
      </header>
      <main className="main">
        <section className="left">
          <h1>Create your account</h1>
          <p>Open a secure bank account in minutes.</p>
          <SignupForm apiBase={apiBase} />
        </section>
        <aside className="right">
          <Chatbot apiBase={apiBase} />
        </aside>
      </main>
      <footer className="footer">© {new Date().getFullYear()} Acme Bank</footer>
    </div>
  )
}
