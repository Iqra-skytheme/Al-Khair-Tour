"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadField } from "@/components/admin/image-upload-field";

export function ZiyaratForm({ pkg, action, token }) {
  const [error, setError] = useState("");

  const onSubmit = async (formData) => {
    setError("");
    const result = await action(formData);
    if (result?.error) setError(result.error);
  };

  return (
    <form action={onSubmit} className="grid max-w-2xl gap-4">
      {!pkg && (
        <Field label="ID (unique, no spaces — leave blank to auto-generate from title)">
          <Input name="id" placeholder="e.g. makkah-half-day" />
        </Field>
      )}
      <Field label="Title">
        <Input name="title" required defaultValue={pkg?.title} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="City">
          <Input name="city" required placeholder="e.g. Makkah" defaultValue={pkg?.city ?? ""} />
        </Field>
        <Field label="Duration">
          <Input name="duration" placeholder="e.g. 4 hours" defaultValue={pkg?.duration ?? ""} />
        </Field>
      </div>
      <Field label="Price (SAR)" hint="Khali chhoray to price website par show nahi hogi.">
        <Input type="number" name="price_sar" min={0} defaultValue={pkg?.price_sar ?? ""} />
      </Field>

      <ImageUploadField name="hero" label="Hero image" token={token} defaultUrl={pkg?.hero ?? ""} />

      <Field label="Summary">
        <Textarea name="summary" rows={2} defaultValue={pkg?.summary ?? ""} />
      </Field>
      <Field label="Visit place (one per line)">
        <Textarea name="stops" rows={4} defaultValue={pkg?.stops?.join("\n") ?? ""} />
      </Field>
      <Field label="Includes (one per line)">
        <Textarea name="includes" rows={3} defaultValue={pkg?.includes?.join("\n") ?? ""} />
      </Field>
      <Field label="Excludes (one per line)">
        <Textarea name="excludes" rows={3} defaultValue={pkg?.excludes?.join("\n") ?? ""} />
      </Field>
      <Field label="Guide languages (one per line)">
        <Textarea
          name="guide_languages"
          rows={2}
          defaultValue={pkg?.guide_languages?.join("\n") ?? "English\nUrdu\nArabic"}
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Sort order">
          <Input type="number" name="sort_order" defaultValue={pkg?.sort_order ?? 0} />
        </Field>
        <label className="mt-6 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={pkg?.published ?? true}
            className="h-4 w-4"
          />
          Published (visible on website)
        </label>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-fit">
        {pkg ? "Save changes" : "Create package"}
      </Button>
    </form>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}