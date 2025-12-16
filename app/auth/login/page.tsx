"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthCard } from "../components/auth-card";
import { AuthHeader } from "../components/auth-header";
import { Input } from "../../components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: auth logic
    console.log({ email, password });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <AuthCard>
        <AuthHeader
          title="Welcome back"
          description="Login to your Humana account"
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Don’t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Create one
          </Link>
        </div>
      </AuthCard>
    </main>
  );
}
