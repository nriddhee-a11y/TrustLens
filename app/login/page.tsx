"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await signIn("password", { email, password, flow });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Trust<span className="text-accent">Lens</span>
          </h1>
          <p className="text-neutral-400 text-sm mt-2">
            Not just "is it fake?" — can you trust it?
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-panel border border-border rounded-xl p-6 space-y-4"
        >
          <div>
            <label className="text-xs text-neutral-400">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 bg-panel2 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 bg-panel2 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          {error && <p className="text-warning text-xs">{error}</p>}

          <button
            type="submit"
            className="w-full bg-accent hover:bg-accentHover transition rounded-lg py-2 text-sm font-medium"
          >
            {flow === "signIn" ? "Sign in" : "Create account"}
          </button>

          <button
            type="button"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
            className="w-full text-xs text-neutral-400 hover:text-white"
          >
            {flow === "signIn"
              ? "Need an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
