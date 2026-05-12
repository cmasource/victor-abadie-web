"use client";

import Script from "next/script";
import Link from "next/link";
import { useMemo } from "react";
import type { InstagramWidgetProvider } from "@/config/instagramWidget";

type InstagramExternalWidgetProps = {
  provider: InstagramWidgetProvider;
  scriptSrc?: string;
  containerHtml?: string;
  rawEmbedHtml?: string;
};

type ParsedEmbed = {
  html: string;
  scripts: string[];
};

export function InstagramExternalWidget({
  provider,
  scriptSrc = "",
  containerHtml = "",
  rawEmbedHtml = "",
}: InstagramExternalWidgetProps) {
  const parsedEmbed = useMemo(() => parseEmbedHtml(rawEmbedHtml), [rawEmbedHtml]);
  const html = containerHtml || parsedEmbed.html;
  const scripts = Array.from(new Set([scriptSrc, ...parsedEmbed.scripts].filter(Boolean)));

  if (!html && scripts.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 overflow-hidden rounded-lg border border-black/5 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold text-muted">
          Publicaciones de Instagram
        </p>
        <Link
          href="https://www.instagram.com/victorabadieinmo"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-black/10 px-4 py-2 text-center text-sm font-black text-[#111111] transition hover:border-brand hover:text-brand-dark"
        >
          Ver Instagram
        </Link>
      </div>

      {scripts.map((src) => {
        const id = `instagram-widget-${provider}-${hashString(src)}`;
        return <Script key={id} id={id} src={src} strategy="afterInteractive" />;
      })}

      {html ? (
        <div
          className="instagram-widget-content w-full max-w-full overflow-hidden"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div className="rounded-md bg-surface px-4 py-6 text-center text-sm font-bold text-muted">
          Cargando publicaciones de Instagram...
        </div>
      )}
    </div>
  );
}

function parseEmbedHtml(rawEmbedHtml: string): ParsedEmbed {
  if (!rawEmbedHtml) {
    return { html: "", scripts: [] };
  }

  const scripts: string[] = [];
  const html = rawEmbedHtml
    .replace(
      /<script\b[^>]*src=["']([^"']+)["'][^>]*>\s*<\/script>/gi,
      (_match, src: string) => {
        scripts.push(src);
        return "";
      },
    )
    .replace(/<script\b(?![^>]*src=)[\s\S]*?<\/script>/gi, "");

  return { html, scripts };
}

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
