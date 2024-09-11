"use client";

import InstallPrompt from "./InstallPrompt";

export default function InstallPromptWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <InstallPrompt>{children}</InstallPrompt>;
}
