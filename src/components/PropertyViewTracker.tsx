"use client";

import { useEffect } from "react";
import { trackPropertyView } from "@/lib/analyticsEvents";

type PropertyViewTrackerProps = {
  slug: string;
  title: string;
  operation: string;
  type: string;
  location: string;
};

export function PropertyViewTracker({
  slug,
  title,
  operation,
  type,
  location,
}: PropertyViewTrackerProps) {
  useEffect(() => {
    trackPropertyView({
      property_slug: slug,
      property_title: title,
      operation,
      property_type: type,
      location,
    });
  }, [location, operation, slug, title, type]);

  return null;
}
