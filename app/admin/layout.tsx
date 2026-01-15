import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel - IBSM Global Security Solutions",
  description: "Admin panel for managing IBSM Global Security Solutions",
};

import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeRegistry>
      {children}
    </ThemeRegistry>
  );
}

