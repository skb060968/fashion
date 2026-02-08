"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      setError("Invalid credentials")
      return
    }

    router.push("/admin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-4 border p-6 rounded-lg"
      >
        <h1 className="text-xl font-semibold text-center">Admin Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

       <button
  type="submit"
  className="w-full rounded-lg py-3 font-semibold text-white
                  bg-gradient-to-r from-fashion-gold to-amber-500
                  hover:from-amber-500 hover:to-fashion-gold
                  shadow-md hover:shadow-xl
                  transform hover:-translate-y-0.5 active:translate-y-0
                  transition-all duration-300"
>
  Login
</button>

      </form>
    </div>
  )
}
