"use client";

import { logout } from "@/lib/logout";

export default function LogoutButton() {
  return <button onClick={() => logout()}>로그아웃</button>;
}
