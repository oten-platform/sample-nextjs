"use client"
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button className="button logout" onClick={() => signOut({ callbackUrl: "/" })}>
      Log Out
    </button>
  );
};

