"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('isAdmin');
    window.location.href = '/admin-login';
  };

  // Token expiration check
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          handleLogout();
        }
      } catch {
        handleLogout();
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/api/admin/login", {
        username,
        password
      });
      const { token } = res.data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminToken', token);
        sessionStorage.setItem('isAdmin', 'true');
        window.location.href = "/add-memory";
      }
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError("Invalid credentials. Please try again.");
      } else {
        setError("Server error. Please try again later.");
      }
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
        <Button type="button" onClick={handleLogout} className="w-full mt-2 bg-destructive text-white py-2 rounded">Logout</Button>
      </form>
    </div>
  );
}
