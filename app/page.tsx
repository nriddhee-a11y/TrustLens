"use client";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <AuthLoading>
        <div className="min-h-screen flex items-center justify-center text-neutral-500 text-sm">
          Loading...
        </div>
      </AuthLoading>
      <Unauthenticated>
        <Redirect to="/login" />
      </Unauthenticated>
      <Authenticated>
        <Redirect to="/dashboard" />
      </Authenticated>
    </>
  );
}

function Redirect({ to }: { to: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(to);
  }, [to]);
  return null;
}
