"use client"
import { signIn } from "next-auth/react";

export function LoginButton() {
  return (
    <button className="button login" onClick={() => signIn("oten-idp", { callbackUrl: "/" })}>
      Log In
    </button>
  );
};

