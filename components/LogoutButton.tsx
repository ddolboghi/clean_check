"use client";

import { logout } from "@/lib/logout";

export default function LogoutButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return <button onClick={() => logout()}>{children}</button>;
}
