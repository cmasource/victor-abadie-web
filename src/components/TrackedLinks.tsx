"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import {
  trackInstagramClick,
  trackPropertyCardClick,
  trackWhatsAppClick,
} from "@/lib/analyticsEvents";

type BaseTrackedLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
} & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "className" | "target" | "rel" | "aria-label" | "onClick"
>;

type WhatsAppTrackedLinkProps = BaseTrackedLinkProps & {
  source:
    | "floating_button"
    | "property_card"
    | "property_detail"
    | "footer"
    | "contact_page"
    | "sell_property"
    | "site_cta";
  propertySlug?: string;
  propertyTitle?: string;
  operation?: string;
  propertyType?: string;
};

type PropertyCardTrackedLinkProps = BaseTrackedLinkProps & {
  propertySlug: string;
  propertyTitle: string;
  source: "home" | "properties_page" | "property_card";
};

type InstagramTrackedLinkProps = BaseTrackedLinkProps & {
  source: "home_section" | "footer" | "contact_page";
};

export function TrackedWhatsAppLink({
  href,
  children,
  className,
  target,
  rel,
  ariaLabel,
  source,
  propertySlug,
  propertyTitle,
  operation,
  propertyType,
  ...props
}: WhatsAppTrackedLinkProps) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      className={className}
      onClick={() =>
        trackWhatsAppClick({
          source,
          property_slug: propertySlug,
          property_title: propertyTitle,
          operation,
          property_type: propertyType,
        })
      }
      {...props}
    >
      {children}
    </Link>
  );
}

export function TrackedPropertyCardLink({
  href,
  children,
  className,
  target,
  rel,
  ariaLabel,
  propertySlug,
  propertyTitle,
  source,
  ...props
}: PropertyCardTrackedLinkProps) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      className={className}
      onClick={() =>
        trackPropertyCardClick({
          source,
          property_slug: propertySlug,
          property_title: propertyTitle,
        })
      }
      {...props}
    >
      {children}
    </Link>
  );
}

export function TrackedInstagramLink({
  href,
  children,
  className,
  target,
  rel,
  ariaLabel,
  source,
  ...props
}: InstagramTrackedLinkProps) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      className={className}
      onClick={() => trackInstagramClick({ source })}
      {...props}
    >
      {children}
    </Link>
  );
}
