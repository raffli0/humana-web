"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthCard } from "../components/auth-card";
import { AuthHeader } from "../components/auth-header";
import { Input } from "../../components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: register logic
    console.log({ name, email, password });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <AuthCard>
        <AuthHeader
          title="Create an account"
          description="Join Humana to manage your team"
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </AuthCard>
    </main>
  );
}
