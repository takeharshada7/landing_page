import React, { useState } from 'react'

export function Chatbot({ apiBase }) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm your banking assistant. Ask me anything." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendMessage(e) {
    e.preventDefault()
    if (!input.trim() || loading) return
    const userMsg = { from: 'you', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text })
      })
      const data = await res.json()
      const botMsg = { from: 'bot', text: data.reply || 'Sorry, I did not catch that.' }
      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      setMessages(prev => [...prev, { from: 'bot', text: 'Network error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chatbot card">
      <div className="chatlog">
        {messages.map((m, i) => (
          <div key={i} className={m.from === 'bot' ? 'msg bot' : 'msg you'}>
            {m.text}
          </div>
        ))}
      </div>
      <form className="chatinput" onSubmit={sendMessage}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message…" />
        <button disabled={loading || !input.trim()}>{loading ? '...' : 'Send'}</button>
      </form>
    </div>
  )
}
