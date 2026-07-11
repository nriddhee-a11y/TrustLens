"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

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

    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
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
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className="border-2 border-dashed border-border hover:border-accent transition rounded-xl p-12 text-center cursor-pointer bg-panel"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*,audio/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        {uploading ? (
          <p className="text-accent text-sm">Uploading...</p>
        ) : (
          <>
            <p className="text-white font-medium">
              Drop a file here, or click to upload
            </p>
            <p className="text-neutral-500 text-sm mt-1">
              Image, video, or audio
            </p>
          </>
        )}
      </div>
      {error && <p className="text-warning text-sm mt-2">{error}</p>}
    </div>
  );
}
