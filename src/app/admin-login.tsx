"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/admin/login", { username, password });
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminToken', res.data.token);
        window.location.href = "/add-memory";
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-card">
      <form onSubmit={handleLogin} className="bg-background p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
        {error && <p className="text-destructive text-center">{error}</p>}
        <div>
          <label className="block mb-2 font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
            placeholder="Enter admin username"
            title="Admin Username"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
            placeholder="Enter admin password"
            title="Admin Password"
          />
        </div>
        <Button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded">Login</Button>
      </form>
    </div>
  );
}
