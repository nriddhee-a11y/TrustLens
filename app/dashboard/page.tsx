"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UploadForm } from "../components/UploadForm";
import { ScanCard } from "../components/ScanCard";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useEffect } from "react";

export default function DashboardPage() {
  return (
    <>
      <AuthLoading>
        <div className="min-h-screen flex items-center justify-center text-neutral-500 text-sm">
          Loading...
        </div>
      </AuthLoading>
      <Unauthenticated>
        <RedirectToLogin />
      </Unauthenticated>
      <Authenticated>
        <DashboardContent />
      </Authenticated>
    </>
  );
}

function RedirectToLogin() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login");
  }, []);
  return null;
}

function DashboardContent() {
  const scans = useQuery(api.scans.listMyScans);
  const { signOut } = useAuthActions();
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">
          Trust<span className="text-accent">Lens</span>
        </h1>
        <button
          onClick={async () => {
            await signOut();
            router.push("/login");
          }}
          className="text-xs text-neutral-500 hover:text-white"
        >
          Sign out
        </button>
      </div>

      <div className="mb-10">
        <UploadForm />
      </div>

      <h2 className="text-sm font-semibold text-neutral-400 mb-3">
        Scan History
      </h2>
      <div className="space-y-3">
        {scans === undefined && (
          <p className="text-neutral-600 text-sm">Loading...</p>
        )}
        {scans?.length === 0 && (
          <p className="text-neutral-600 text-sm">
            No scans yet. Upload a file above to get started.
          </p>
        )}
        {scans?.map((scan) => (
          <ScanCard key={scan._id} scan={scan} />
        ))}
      </div>
    </div>
  );
}
