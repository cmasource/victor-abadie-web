"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "No se pudo iniciar sesión.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        className="rounded-md border border-black/10 px-4 py-3 outline-none focus:border-brand"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Contraseña"
        className="rounded-md border border-black/10 px-4 py-3 outline-none focus:border-brand"
        required
      />
      {error ? (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-brand px-5 py-3 text-sm font-black text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
      <Link
        href="/admin/recuperar-password"
        className="text-center text-sm font-black text-brand-dark hover:text-brand"
      >
        Olvidé mi contraseña
      </Link>
    </form>
  );
}
