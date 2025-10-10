import React, { useState } from 'react'

export function SignupForm({ apiBase }) {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await fetch(`${apiBase}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || data?.errors?.[0]?.msg || 'Signup failed')
      setResult(data)
      setForm({ fullName: '', email: '', phone: '', password: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="field">
        <label>Full name</label>
        <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Jane Doe" required minLength={3} />
      </div>
      <div className="field">
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" required />
      </div>
      <div className="field">
        <label>Phone</label>
        <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+1234567890" />
      </div>
      <div className="field">
        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Strong password" required minLength={8} />
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
      {result && <p className="success">Welcome, {result.fullName}! Account created.</p>}
      {error && <p className="error">{error}</p>}
    </form>
  )
}
