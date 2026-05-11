"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    async function prepareSession() {
      try {
        const supabase = createSupabaseBrowserClient();
        const code = searchParams.get("code");
        if (code) {
          const { error: codeError } = await supabase.auth.exchangeCodeForSession(code);
          if (codeError) {
            setError(`No se pudo validar el enlace: ${codeError.message}`);
            return;
          }
        }

        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (sessionError) {
            setError(`No se pudo iniciar la recuperación: ${sessionError.message}`);
            return;
          }
        }

        setSessionReady(true);
      } catch (exception) {
        setError(
          exception instanceof Error
            ? `No se pudo preparar la recuperación: ${exception.message}`
            : "No se pudo preparar la recuperación.",
        );
      }
    }

    prepareSession();
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("Completá todos los campos.");
      return;
    }

    if (newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("La nueva contraseña y la confirmación no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError(`No se pudo actualizar la contraseña: ${updateError.message}`);
        return;
      }

      setSuccess("Contraseña actualizada correctamente.");
      window.setTimeout(() => {
        router.replace("/admin/login");
      }, 900);
    } catch (exception) {
      setError(
        exception instanceof Error
          ? `No se pudo actualizar la contraseña: ${exception.message}`
          : "No se pudo actualizar la contraseña.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <input
        type="password"
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
        placeholder="Nueva contraseña"
        className="rounded-md border border-black/10 px-4 py-3 outline-none focus:border-brand"
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        placeholder="Confirmar nueva contraseña"
        className="rounded-md border border-black/10 px-4 py-3 outline-none focus:border-brand"
      />

      {!sessionReady && !error ? (
        <p className="rounded-md bg-surface px-4 py-3 text-sm font-bold text-muted">
          Validando enlace de recuperación...
        </p>
      ) : null}
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
        disabled={loading || !sessionReady}
        className="rounded-md bg-brand px-5 py-3 text-sm font-black text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {loading ? "Actualizando..." : "Restablecer contraseña"}
      </button>
    </form>
  );
}
