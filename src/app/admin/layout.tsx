import React from "react";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Admin Panel",
}

export default function MetadataLayout({ children }: { children: React.ReactNode }) {
  return children;
}