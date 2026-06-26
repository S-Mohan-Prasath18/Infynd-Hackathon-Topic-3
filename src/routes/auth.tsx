import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Sign in — ST Software Solution" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate({ to: "/admin" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      // Provide a friendlier message for common errors
      if (message.includes("Invalid login credentials")) {
        setMsg("Invalid email or password. Please check your credentials.");
      } else if (message.includes("Email not confirmed")) {
        setMsg("Email not confirmed. Please confirm your email or contact the admin.");
      } else {
        setMsg(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link to="/" className="font-mono text-sm text-muted hover:text-primary">← back to site</Link>
        <div className="mt-6 border border-white/10 bg-surface/40 p-8">
          <h1 className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Restricted</h1>
          <h2 className="mt-2 text-2xl font-bold">Admin Sign in</h2>
          <p className="mt-2 text-sm text-muted">Authorized personnel only.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Password</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
            {msg && <p className="text-xs text-primary">{msg}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-background transition hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
