"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ImageUploadField({ name = "image", label = "Image", token, defaultUrl }) {
  const [imageUrl, setImageUrl] = useState(defaultUrl || "");
  const [preview, setPreview] = useState(defaultUrl || "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      setImageUrl(data.url);
      setPreview(data.url);
    } catch (err) {
      setUploadError(err.message || "Image upload nahi ho saka. Dobara try karain.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <input type="hidden" name={name} value={imageUrl} />
      <Input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
      {uploading && <p className="text-xs text-muted-foreground">Uploading…</p>}
      {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="mt-2 h-32 w-32 rounded-md border object-cover"
        />
      )}
    </div>
  );
}