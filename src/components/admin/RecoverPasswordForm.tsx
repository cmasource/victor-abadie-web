"use client";

import { FormEvent, useState } from "react";
import { siteConfig } from "@/config/site";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function RecoverPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Ingresá tu email.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteConfig.siteUrl}/admin/restablecer-password`,
      });

      if (resetError) {
        setError(`No se pudo enviar el enlace: ${resetError.message}`);
        return;
      }

      setSuccess("Si el email existe, recibirás un enlace para restablecer la contraseña.");
      setEmail("");
    } catch (exception) {
      setError(
        exception instanceof Error
          ? `No se pudo enviar el enlace: ${exception.message}`
          : "No se pudo enviar el enlace.",
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

      {error ? (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="rounded-md bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
          {success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-brand px-5 py-3 text-sm font-black text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {loading ? "Enviando..." : "Enviar enlace de recuperación"}
      </button>
    </form>
  );
}
