"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

function detectMediaType(file: File): "image" | "video" | "audio" | null {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return null;
}

export function UploadForm() {
  const generateUploadUrl = useMutation(api.scans.generateUploadUrl);
  const createScan = useMutation(api.scans.createScan);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    const mediaType = detectMediaType(file);
    if (!mediaType) {
      setError("Please upload an image, video, or audio file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That file is larger than 50 MB. Please choose a smaller file.");
      return;
    }

    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!result.ok) throw new Error("Upload failed. Please try again.");
      const { storageId } = await result.json();

      const scanId = await createScan({
        fileId: storageId,
        fileName: file.name,
        mediaType,
      });

      router.push(`/scan/${scanId}`);
    } catch (err: any) {
      setError(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {/* A real <button> so the drop zone is reachable and usable by keyboard
          and screen readers; drag-and-drop remains as an enhancement. */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        disabled={uploading}
        aria-describedby="upload-help"
        className="w-full border-2 border-dashed border-border hover:border-accent focus-visible:border-accent transition rounded-xl p-12 text-center cursor-pointer bg-panel disabled:cursor-wait"
      >
        {uploading ? (
          <span role="status" className="text-accent text-sm">
            Uploading...
          </span>
        ) : (
          <>
            <span className="block text-white font-medium">
              Drop a file here, or press to choose one
            </span>
            <span
              id="upload-help"
              className="block text-neutral-400 text-sm mt-1"
            >
              Image, video, or audio · up to 50 MB
            </span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*,audio/*"
        className="sr-only"
        tabIndex={-1}
        aria-label="Choose an image, video, or audio file to scan"
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        }}
      />
      <p role="alert" className="text-warning text-sm mt-2 empty:hidden">
        {error}
      </p>
    </div>
  );
}
