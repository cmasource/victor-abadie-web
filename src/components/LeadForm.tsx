"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  GENERAL_WHATSAPP_MESSAGE,
  SELL_PROPERTY_MESSAGE,
  buildWhatsAppLink,
} from "@/lib/whatsapp";

type LeadFormProps = {
  mode: "sell" | "contact";
};

export function LeadForm({ mode }: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fullMessage = useMemo(() => {
    const base = mode === "sell" ? SELL_PROPERTY_MESSAGE : GENERAL_WHATSAPP_MESSAGE;

    return [
      base,
      name ? `Nombre: ${name}` : "",
      phone ? `Teléfono: ${phone}` : "",
      propertyType ? `Tipo de propiedad: ${propertyType}` : "",
      location ? `Ubicación: ${location}` : "",
      message ? `Mensaje: ${message}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }, [location, message, mode, name, phone, propertyType]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !phone.trim()) {
      setError("Completá nombre y teléfono para armar la consulta por WhatsApp.");
      return;
    }

    setError("");
    window.open(buildWhatsAppLink(fullMessage), "_blank", "noopener,noreferrer");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-lg border border-black/5 bg-white p-5 card-shadow"
    >
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Nombre"
        className="rounded-md border border-black/10 px-4 py-3 outline-none focus:border-brand"
      />
      <input
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        placeholder="Teléfono"
        className="rounded-md border border-black/10 px-4 py-3 outline-none focus:border-brand"
      />
      <input
        value={propertyType}
        onChange={(event) => setPropertyType(event.target.value)}
        placeholder="Tipo de propiedad"
        className="rounded-md border border-black/10 px-4 py-3 outline-none focus:border-brand"
      />
      <input
        value={location}
        onChange={(event) => setLocation(event.target.value)}
        placeholder="Ubicación"
        className="rounded-md border border-black/10 px-4 py-3 outline-none focus:border-brand"
      />
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Mensaje"
        rows={5}
        className="resize-none rounded-md border border-black/10 px-4 py-3 outline-none focus:border-brand"
      />
      {error ? (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        className="rounded-md bg-brand px-5 py-3 text-center text-sm font-extrabold text-white transition hover:bg-brand-dark"
      >
        {mode === "sell"
          ? "Quiero vender mi propiedad"
          : "Enviar consulta por WhatsApp"}
      </button>
    </form>
  );
}
